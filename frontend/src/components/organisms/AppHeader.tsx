import React from 'react';
import { theme } from '../../styles/theme';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ShieldCheck, LogOut, User } from 'lucide-react';
import { UserDTO, ChildSessionDTO } from '../../types';

export interface AppHeaderProps {
  systemStatus?: 'ok' | 'degraded' | 'error';
  adultUser?: UserDTO | null;
  childSession?: ChildSessionDTO | null;
  onAdminClick?: () => void;
  onLogoutAdult?: () => void;
  onLeaveChildSession?: () => void;
  onBrandClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  systemStatus = 'ok',
  adultUser,
  childSession,
  onAdminClick,
  onLogoutAdult,
  onLeaveChildSession,
  onBrandClick,
}) => {
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
    cursor: 'pointer',
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

  const rightNavStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  return (
    <header style={headerStyles}>
      <div style={brandStyles} onClick={onBrandClick}>
        <div style={logoStyles}>
          <ShieldCheck size={26} />
        </div>
        <div>
          <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            Kidssafe
          </div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
            IT-Sicherheitskompetenz
          </div>
        </div>
      </div>

      <div style={rightNavStyles}>
        <Badge variant={systemStatus === 'ok' ? 'success' : 'warning'}>
          {systemStatus === 'ok' ? 'System bereit' : 'Offline / Standalone'}
        </Badge>

        {/* Erwachsener eingeloggt */}
        {adultUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.sm }}>
              <User size={16} color={theme.colors.text.secondary} />
              <span style={{ fontWeight: theme.typography.fontWeight.medium }}>{adultUser.username}</span>
            </div>
            <Badge variant="primary">{adultUser.role === 'TEACHER' ? 'Lehrkraft' : 'Eltern'}</Badge>
            <Button size="sm" variant="outline" onClick={onLogoutAdult}>
              <LogOut size={14} style={{ marginRight: theme.spacing.xs }} />
              Abmelden
            </Button>
          </div>
        )}

        {/* Kind eingeloggt */}
        {!adultUser && childSession && (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <Badge variant="success">Code: {childSession.code}</Badge>
            <Button size="sm" variant="outline" onClick={onLeaveChildSession}>
              <LogOut size={14} style={{ marginRight: theme.spacing.xs }} />
              Sitzung beenden
            </Button>
          </div>
        )}

        {/* Gast / Nicht eingeloggt */}
        {!adultUser && !childSession && onAdminClick && (
          <Button size="sm" variant="outline" onClick={onAdminClick}>
            Lehrkräfte / Eltern
          </Button>
        )}
      </div>
    </header>
  );
};
