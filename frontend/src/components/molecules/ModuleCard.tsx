import React from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { theme } from '../../styles/theme';

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  level: string;
  isAvailable?: boolean;
  onStart: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  level,
  isAvailable = true,
  onStart,
}) => {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  };

  const iconContainerStyles: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary.light,
    color: theme.colors.primary.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  };

  const descStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.lg,
    flex: 1,
  };

  return (
    <Card hoverEffect style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={headerStyles}>
        <div style={iconContainerStyles}>{icon}</div>
        <Badge variant={isAvailable ? 'success' : 'neutral'}>
          {isAvailable ? 'Bereit für Mission' : 'In Vorbereitung'}
        </Badge>
      </div>

      <h3 style={titleStyles}>{title}</h3>
      <p style={descStyles}>{description}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
          Schwierigkeit: {level}
        </span>
        <Button size="md" variant={isAvailable ? 'primary' : 'outline'} disabled={!isAvailable} onClick={onStart}>
          {isAvailable ? 'Training starten' : 'Gesperrt'}
        </Button>
      </div>
    </Card>
  );
};
