import React, { useState } from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { ModuleCard } from '../molecules/ModuleCard';
import { theme } from '../../styles/theme';
import { ChildSessionDTO } from '../../types';
import { useStudentHeartbeat } from '../../hooks/useStudentHeartbeat';
import { moduleRegistry } from '../../modules/registry';
import { Sparkles, AlertCircle } from 'lucide-react';

export interface StudentDashboardPageProps {
  session: ChildSessionDTO;
  onLeaveSession: () => void;
  onOpenModule: (slug: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  session,
  onLeaveSession,
  onOpenModule,
}) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  // Sendet automatisch alle 30s ein datensparsames Lebenszeichen an die Lehrkraft
  useStudentHeartbeat(
    {
      activeModule: undefined,
      completedScenarios: 0,
      totalScenarios: 0,
    },
    session.sessionToken
  );

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
          {session.label && (
            <div style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.primary.hover, marginBottom: '2px' }}>
              Gerät: {session.label}
            </div>
          )}
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
        {moduleRegistry.getAllModules().map((m) => (
          <ModuleCard
            key={m.slug}
            title={m.title}
            description={m.description}
            icon={m.icon}
            level={m.level}
            isAvailable={m.enabled}
            onStart={() => {
              if (m.enabled) {
                onOpenModule(m.slug);
              } else {
                setActiveMessage(`Das Modul "${m.title}" befindet sich derzeit in Vorbereitung (Meilenstein 5.3).`);
              }
            }}
          />
        ))}
      </div>
    </BaseLayout>
  );
};
