import React, { useEffect, useState } from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { CodeInputGroup } from '../molecules/CodeInputGroup';
import { Button } from '../atoms/Button';
import { theme } from '../../styles/theme';
import { fetchHealthStatus } from '../../services/apiClient';
import { Sparkles, KeyRound, School, PlayCircle, AlertCircle } from 'lucide-react';

export interface HomePageProps {
  onCodeSubmit: (code: string) => Promise<void>;
  onStartGuest: () => Promise<void>;
  onAdminClick: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  onCodeSubmit,
  onStartGuest,
  onAdminClick,
  isLoading = false,
  error,
}) => {
  const [systemStatus, setSystemStatus] = useState<'ok' | 'degraded' | 'error'>('ok');

  useEffect(() => {
    fetchHealthStatus()
      .then((data) => setSystemStatus(data.status))
      .catch(() => setSystemStatus('degraded'));
  }, []);

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
    width: '100%',
    maxWidth: '460px',
  };

  return (
    <BaseLayout systemStatus={systemStatus} onAdminClick={onAdminClick}>
      <div style={heroStyles}>
        <div style={badgeStyles}>
          <Sparkles size={16} />
          <span>Lernplattform für IT-Sicherheit</span>
        </div>

        <h1 style={titleStyles}>Sicher durchs Netz – mit Köpfchen!</h1>

        <p style={descStyles}>
          Gib deinen Einladungscode von deiner Lehrkraft oder deinen Eltern ein, um deine Mission zu starten.
        </p>

        {error && (
          <div style={{ backgroundColor: theme.colors.danger.light, color: theme.colors.danger.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, display: 'flex', alignItems: 'center', gap: theme.spacing.sm, maxWidth: '460px', width: '100%' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div style={cardStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.text.secondary }}>
            <KeyRound size={20} />
            <span style={{ fontWeight: theme.typography.fontWeight.semibold }}>Code-Eingabe</span>
          </div>

          <CodeInputGroup onSubmit={onCodeSubmit} isLoading={isLoading} />

          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, width: '100%', margin: `${theme.spacing.xs} 0` }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>oder</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
          </div>

          <Button variant="outline" size="md" fullWidth onClick={onStartGuest} disabled={isLoading}>
            <PlayCircle size={18} style={{ marginRight: theme.spacing.xs }} />
            Ohne Code als Gast ausprobieren (8h)
          </Button>

          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
            <School size={14} />
            <span>Vollständig pseudonymisiert: Keine Registrierung & kein Klarname erforderlich</span>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
