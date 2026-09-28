import React from 'react';
import { theme } from '../../styles/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary.default,
          color: theme.colors.secondary.contrast,
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary.default,
          border: `1.5px solid ${theme.colors.primary.default}`,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.danger.default,
          color: theme.colors.danger.contrast,
          border: 'none',
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary.default,
          color: theme.colors.primary.contrast,
          border: 'none',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          fontSize: theme.typography.fontSize.sm,
        };
      case 'lg':
        return {
          padding: `${theme.spacing.md} ${theme.spacing.xl}`,
          fontSize: theme.typography.fontSize.lg,
        };
      case 'md':
      default:
        return {
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
          fontSize: theme.typography.fontSize.md,
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.semibold,
    borderRadius: theme.borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: theme.shadows.sm,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button style={baseStyles} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
