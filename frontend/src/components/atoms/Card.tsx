import React from 'react';
import { theme } from '../../styles/theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'lg',
  hoverEffect = false,
  style,
  ...props
}) => {
  const getPaddingValue = (): string => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'xl':
        return theme.spacing.xl;
      case 'lg':
      default:
        return theme.spacing.lg;
    }
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    padding: getPaddingValue(),
    transition: hoverEffect ? 'transform 0.2s, box-shadow 0.2s' : undefined,
    cursor: hoverEffect ? 'pointer' : undefined,
    ...style,
  };

  return (
    <div style={cardStyles} {...props}>
      {children}
    </div>
  );
};
