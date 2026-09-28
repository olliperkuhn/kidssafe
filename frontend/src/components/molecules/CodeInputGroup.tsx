import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { theme } from '../../styles/theme';

export interface CodeInputGroupProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
}

export const CodeInputGroup: React.FC<CodeInputGroupProps> = ({ onSubmit, isLoading = false }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim().toUpperCase());
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    width: '100%',
    maxWidth: '400px',
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    borderRadius: theme.borderRadius.md,
    border: `2px solid ${theme.colors.primary.default}`,
    outline: 'none',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
  };

  return (
    <div style={containerStyles}>
      <form onSubmit={handleSubmit} style={formStyles}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Z. B. SAFE-4A-89"
          maxLength={14}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          style={inputStyles}
          disabled={isLoading}
        />
        <Button type="submit" size="lg" disabled={isLoading || !code.trim()}>
          {isLoading ? '...' : 'Los!'}
        </Button>
      </form>
    </div>
  );
};
