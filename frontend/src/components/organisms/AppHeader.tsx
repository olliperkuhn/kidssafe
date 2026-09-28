import React from 'react';
import { theme } from '../../styles/theme';
import { Badge } from '../atoms/Badge';
import { ShieldCheck } from 'lucide-react';

export interface AppHeaderProps {
  systemStatus?: 'ok' | 'degraded' | 'error';
  onAdminClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ systemStatus = 'ok', onAdminClick }) => {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
  };

  const brandStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textDecoration: 'none',
    color: theme.colors.text.primary,
  };

  const logoStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.light,
    color: theme.colors.primary.default,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  };

  const rightNavStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const adminLinkStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.default,
    fontWeight: theme.typography.fontWeight.medium,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  };

  return (
    <header style={headerStyles}>
      <div style={brandStyles}>
        <div style={logoStyles}>
          <ShieldCheck size={26} />
        </div>
        <div>
          <div style={titleStyles}>Kidssafe</div>
          <div style={subtitleStyles}>IT-Sicherheitskompetenz</div>
        </div>
      </div>

      <div style={rightNavStyles}>
        <Badge variant={systemStatus === 'ok' ? 'success' : 'warning'}>
          {systemStatus === 'ok' ? 'System bereit' : 'Offline / Standalone'}
        </Badge>
        {onAdminClick && (
          <button style={adminLinkStyles} onClick={onAdminClick}>
            Lehrkräfte / Eltern
          </button>
        )}
      </div>
    </header>
  );
};
