import React, { useEffect, useState } from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { CodeInputGroup } from '../molecules/CodeInputGroup';
import { theme } from '../../styles/theme';
import { fetchHealthStatus } from '../../services/apiClient';
import { Sparkles, KeyRound, School } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<'ok' | 'degraded' | 'error'>('ok');
  const [enteredCode, setEnteredCode] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthStatus()
      .then((data) => setSystemStatus(data.status))
      .catch(() => setSystemStatus('degraded'));
  }, []);

  const handleCodeSubmit = (code: string): void => {
    setEnteredCode(code);
  };

  const heroStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: 'auto 0',
    gap: theme.spacing.xl,
  };

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    backgroundColor: theme.colors.primary.light,
    color: theme.colors.primary.default,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.huge,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    maxWidth: '700px',
    lineHeight: theme.typography.lineHeight.tight,
  };

  const descStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    maxWidth: '560px',
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const confirmationStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.success.light,
    color: theme.colors.success.default,
    fontWeight: theme.typography.fontWeight.medium,
  };

  return (
    <BaseLayout systemStatus={systemStatus}>
      <div style={heroStyles}>
        <div style={badgeStyles}>
          <Sparkles size={16} />
          <span>Lernplattform für IT-Sicherheit</span>
        </div>

        <h1 style={titleStyles}>Sicher durchs Netz – mit Köpfchen!</h1>

        <p style={descStyles}>
          Gib deinen Einladungscode von deiner Lehrkraft oder deinen Eltern ein, um deine Mission zu starten.
        </p>

        <div style={cardStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.text.secondary }}>
            <KeyRound size={20} />
            <span style={{ fontWeight: theme.typography.fontWeight.semibold }}>Code-Eingabe</span>
          </div>

          <CodeInputGroup onSubmit={handleCodeSubmit} />

          {enteredCode && (
            <div style={confirmationStyles}>
              Code <strong>{enteredCode}</strong> empfangen (Bereit für Meilenstein 2/3)
            </div>
          )}

          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <School size={14} />
            <span>Vollständig pseudonymisiert: Keine Registrierung & kein Klarname erforderlich</span>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
