import React from 'react';
import { theme } from '../../styles/theme';

export interface ProgressBarProps {
  percent: number;
  height?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = '8px',
  showLabel = false,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const trackStyles: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  };

  const fillStyles: React.CSSProperties = {
    width: `${clampedPercent}%`,
    height: '100%',
    backgroundColor: clampedPercent === 100 ? theme.colors.secondary.default : theme.colors.primary.default,
    borderRadius: theme.borderRadius.full,
    transition: 'width 0.4s ease',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, width: '100%' }}>
      <div style={trackStyles}>
        <div style={fillStyles} />
      </div>
      {showLabel && (
        <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.semibold, minWidth: '35px', textAlign: 'right' }}>
          {clampedPercent}%
        </span>
      )}
    </div>
  );
};
