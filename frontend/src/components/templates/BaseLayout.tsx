import React from 'react';
import { theme } from '../../styles/theme';
import { AppHeader } from '../organisms/AppHeader';
import { UserDTO, ChildSessionDTO } from '../../types';

export interface BaseLayoutProps {
  children: React.ReactNode;
  systemStatus?: 'ok' | 'degraded' | 'error';
  adultUser?: UserDTO | null;
  childSession?: ChildSessionDTO | null;
  onAdminClick?: () => void;
  onLogoutAdult?: () => void;
  onLeaveChildSession?: () => void;
  onBrandClick?: () => void;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  systemStatus = 'ok',
  adultUser,
  childSession,
  onAdminClick,
  onLogoutAdult,
  onLeaveChildSession,
  onBrandClick,
}) => {
  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
  };

  const mainStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
  };

  const footerStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    borderTop: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
  };

  return (
    <div style={containerStyles}>
      <AppHeader
        systemStatus={systemStatus}
        adultUser={adultUser}
        childSession={childSession}
        onAdminClick={onAdminClick}
        onLogoutAdult={onLogoutAdult}
        onLeaveChildSession={onLeaveChildSession}
        onBrandClick={onBrandClick}
      />
      <main style={mainStyles}>{children}</main>
      <footer style={footerStyles}>
        Kidssafe • Open-Source-Infrastruktur für IT-Sicherheitskompetenz • Prototype Fund
      </footer>
    </div>
  );
};
