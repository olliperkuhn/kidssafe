import React from 'react';
import { theme } from '../../styles/theme';

export interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onChange: (tab: 'login' | 'register') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onChange }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  };

  const getTabStyles = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: 'none',
    backgroundColor: isActive ? theme.colors.surface : 'transparent',
    color: isActive ? theme.colors.primary.default : theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.sm,
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    boxShadow: isActive ? theme.shadows.sm : 'none',
    transition: 'all 0.2s',
  });

  return (
    <div style={containerStyles}>
      <button
        type="button"
        style={getTabStyles(activeTab === 'login')}
        onClick={() => onChange('login')}
      >
        Anmelden
      </button>
      <button
        type="button"
        style={getTabStyles(activeTab === 'register')}
        onClick={() => onChange('register')}
      >
        Registrieren
      </button>
    </div>
  );
};
