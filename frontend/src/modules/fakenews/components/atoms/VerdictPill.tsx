import React from 'react';
import { theme } from '../../../../styles/theme';
import { CheckCircle2, AlertOctagon } from 'lucide-react';
import { NewsVerdict } from '../../types';

export interface VerdictPillProps {
  verdict: NewsVerdict;
  size?: 'sm' | 'md';
}

export const VerdictPill: React.FC<VerdictPillProps> = ({ verdict, size = 'md' }) => {
  const isReal = verdict === 'REAL';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        padding: size === 'sm' ? '4px 8px' : '6px 12px',
        borderRadius: theme.borderRadius.full,
        backgroundColor: isReal ? theme.colors.success.light : theme.colors.danger.light,
        color: isReal ? theme.colors.success.default : theme.colors.danger.default,
        fontSize: size === 'sm' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        border: `1px solid ${isReal ? theme.colors.success.default : theme.colors.danger.default}`,
      }}
    >
      {isReal ? <CheckCircle2 size={size === 'sm' ? 14 : 18} /> : <AlertOctagon size={size === 'sm' ? 14 : 18} />}
      <span>{isReal ? 'ECHTE NACHRICHT' : 'FALSCHMELDUNG (FAKE)'}</span>
    </div>
  );
};
