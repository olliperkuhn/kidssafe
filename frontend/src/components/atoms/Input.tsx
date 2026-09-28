import React from 'react';
import { theme } from '../../styles/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  style,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  };

  const inputStyles: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily,
    borderRadius: theme.borderRadius.md,
    border: `1.5px solid ${error ? theme.colors.danger.default : theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    outline: 'none',
    boxShadow: theme.shadows.sm,
    width: '100%',
    ...style,
  };

  const errorStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.danger.default,
  };

  return (
    <div style={containerStyles}>
      {label && <label htmlFor={inputId} style={labelStyles}>{label}</label>}
      <input id={inputId} style={inputStyles} {...props} />
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
};
