import React from 'react';
import { theme } from '../../styles/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const getColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'success':
        return { bg: theme.colors.success.light, text: theme.colors.success.default };
      case 'warning':
        return { bg: theme.colors.warning.light, text: theme.colors.warning.default };
      case 'danger':
        return { bg: theme.colors.danger.light, text: theme.colors.danger.default };
      case 'neutral':
        return { bg: theme.colors.neutral[100], text: theme.colors.neutral[700] };
      case 'primary':
      default:
        return { bg: theme.colors.primary.light, text: theme.colors.primary.default };
    }
  };

  const colors = getColors();

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    backgroundColor: colors.bg,
    color: colors.text,
  };

  return <span style={badgeStyles}>{children}</span>;
};
