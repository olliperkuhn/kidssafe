import React, { useState } from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { ModuleCard } from '../molecules/ModuleCard';
import { theme } from '../../styles/theme';
import { ChildSessionDTO } from '../../types';
import { Fish, Newspaper, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

export interface StudentDashboardPageProps {
  session: ChildSessionDTO;
  onLeaveSession: () => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  session,
  onLeaveSession,
}) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleStartModule = (moduleName: string) => {
    setActiveMessage(`Modul "${moduleName}" wird geladen... Bereite KI-Szenarien vor (Meilenstein 5).`);
  };

  const welcomeCardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    marginBottom: theme.spacing.xl,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.lg,
  };

  return (
    <BaseLayout childSession={session} onLeaveChildSession={onLeaveSession}>
      <div style={welcomeCardStyles}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.primary.default, fontWeight: theme.typography.fontWeight.semibold, fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing.xs }}>
            <Sparkles size={18} />
            <span>Missions-Zentrale</span>
          </div>
          <h1 style={{ fontSize: theme.typography.fontSize.xxl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            Hallo Cyber-Agent!
          </h1>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
            Deine Missionen sind aktiv. Wähle ein Trainingsmodul aus, um IT-Sicherheit zu meistern.
          </p>
        </div>

        <div style={{ backgroundColor: theme.colors.primary.light, padding: `${theme.spacing.sm} ${theme.spacing.md}`, borderRadius: theme.borderRadius.md, textAlign: 'right' }}>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
            Aktiver Zugangscode:
          </div>
          <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary.default }}>
            {session.code}
          </div>
        </div>
      </div>

      {activeMessage && (
        <div style={{ backgroundColor: theme.colors.primary.light, color: theme.colors.primary.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.lg, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <AlertCircle size={20} />
          <span>{activeMessage}</span>
        </div>
      )}

      <h2 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
        Verfügbare Lernmodule
      </h2>

      <div style={gridStyles}>
        <ModuleCard
          title="Phishing Simulator"
          description="Lerne gefälschte E-Mails, betrügerische Links und gefährliche Anhänge in realistischen Simulationen spielerisch zu enttarnen."
          icon={<Fish size={24} />}
          level="Klasse 4-6"
          isAvailable={true}
          onStart={() => handleStartModule('Phishing Simulator')}
        />

        <ModuleCard
          title="Fake News Detektor"
          description="Untersuche Schlagzeilen, Social-Media-Nachrichten und manipulierte Bilder auf ihren Wahrheitsgehalt. Werde zum Fakten-Checker!"
          icon={<Newspaper size={24} />}
          level="Klasse 4-6"
          isAvailable={true}
          onStart={() => handleStartModule('Fake News Detektor')}
        />

        <ModuleCard
          title="Passwort & Datenschutz"
          description="Erfahre, wie sichere Passwörter aufgebaut sind und wie du deine privaten Daten vor neugierigen Blicken schützt."
          icon={<KeyRound size={24} />}
          level="Klasse 4-6"
          isAvailable={false}
          onStart={() => handleStartModule('Passwort & Datenschutz')}
        />
      </div>
    </BaseLayout>
  );
};
