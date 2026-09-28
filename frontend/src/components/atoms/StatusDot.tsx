import React from 'react';
import { theme } from '../../styles/theme';
import { StudentActivityStatus } from '../../types';
import { CheckCircle2 } from 'lucide-react';

export interface StatusDotProps {
  status: StudentActivityStatus;
  showText?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, showText = true }) => {
  const getStatusColor = (): string => {
    switch (status) {
      case 'ONLINE':
        return theme.colors.success.default;
      case 'COMPLETED':
        return theme.colors.secondary.default;
      case 'OFFLINE':
      default:
        return theme.colors.neutral[400];
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'ONLINE':
        return 'Online';
      case 'COMPLETED':
        return 'Abgeschlossen';
      case 'OFFLINE':
      default:
        return 'Inaktiv';
    }
  };

  const dotColor = getStatusColor();

  const dotStyles: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: dotColor,
    boxShadow: status === 'ONLINE' ? `0 0 0 3px ${theme.colors.success.light}` : undefined,
    display: 'inline-block',
  };

  if (status === 'COMPLETED') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.secondary.default, fontWeight: theme.typography.fontWeight.semibold }}>
        <CheckCircle2 size={14} />
        {showText && getStatusText()}
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: status === 'ONLINE' ? theme.colors.success.default : theme.colors.text.muted, fontWeight: theme.typography.fontWeight.medium }}>
      <span style={dotStyles} />
      {showText && getStatusText()}
    </span>
  );
};
