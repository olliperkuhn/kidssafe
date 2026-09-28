import React, { useState } from 'react';
import { HomePage } from './components/pages/HomePage';
import { StudentDashboardPage } from './components/pages/StudentDashboardPage';
import { TeacherDashboardPage } from './components/pages/TeacherDashboardPage';
import { ParentDashboardPage } from './components/pages/ParentDashboardPage';
import { AuthModal } from './components/organisms/AuthModal';
import { useAdultAuth } from './hooks/useAdultAuth';
import { useChildSession } from './hooks/useChildSession';
import { moduleRegistry } from './modules/registry';
import { LoginPayload, RegisterPayload } from './services/authApi';

export const App: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeChildModule, setActiveChildModule] = useState<string | null>(null);
  const adultAuth = useAdultAuth();
  const childSession = useChildSession();

  const handleLogin = async (payload: LoginPayload) => {
    await adultAuth.login(payload);
    setIsAuthModalOpen(false);
  };

  const handleRegister = async (payload: RegisterPayload) => {
    await adultAuth.register(payload);
    setIsAuthModalOpen(false);
  };

  const handleCodeSubmit = async (code: string) => {
    await childSession.loginWithCode(code);
  };

  const handleStartGuest = async () => {
    await childSession.startGuest();
  };

  // 1. Kind ist eingeloggt (oder Sitzung wurde automatisch per Cookie wiederhergestellt)
  if (childSession.session) {
    if (activeChildModule) {
      const plugin = moduleRegistry.getModule(activeChildModule);
      if (plugin && plugin.enabled) {
        const ModuleComponent = plugin.component;
        return (
          <ModuleComponent
            session={childSession.session}
            onBack={() => setActiveChildModule(null)}
            onLeaveSession={() => {
              setActiveChildModule(null);
              childSession.leaveSession();
            }}
          />
        );
      }
    }

    return (
      <StudentDashboardPage
        session={childSession.session}
        onLeaveSession={childSession.leaveSession}
        onOpenModule={(slug) => setActiveChildModule(slug)}
      />
    );
  }

  // 2. Erwachsener (Lehrkraft oder Elternteil) ist eingeloggt
  if (adultAuth.user && adultAuth.token) {
    if (adultAuth.user.role === 'TEACHER' || adultAuth.user.role === 'ADMIN') {
      return (
        <TeacherDashboardPage
          user={adultAuth.user}
          token={adultAuth.token}
          onLogout={adultAuth.logout}
        />
      );
    }
    return (
      <ParentDashboardPage
        user={adultAuth.user}
        onLogout={adultAuth.logout}
      />
    );
  }

  // 3. Standard-Startseite für Kinder und Besucher
  return (
    <>
      <HomePage
        onCodeSubmit={handleCodeSubmit}
        onStartGuest={handleStartGuest}
        onAdminClick={() => setIsAuthModalOpen(true)}
        isLoading={childSession.isLoading || childSession.isCheckingSession}
        error={childSession.error}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={adultAuth.isLoading}
        error={adultAuth.error}
      />
    </>
  );
};

export default App;
