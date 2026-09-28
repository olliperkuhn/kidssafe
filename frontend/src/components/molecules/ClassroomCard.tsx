import React from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { theme } from '../../styles/theme';
import { ClassroomDTO } from '../../types';
import { Users, PlusCircle, Printer, Activity } from 'lucide-react';

export interface ClassroomCardProps {
  classroom: ClassroomDTO;
  onGenerateCodes: (classroom: ClassroomDTO) => void;
  onPrintCodes: (classroom: ClassroomDTO) => void;
  onOpenLiveMonitor?: (classroom: ClassroomDTO) => void;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onGenerateCodes,
  onPrintCodes,
  onOpenLiveMonitor,
}) => {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
  };

  return (
    <Card>
      <div style={headerStyles}>
        <div style={titleStyles}>
          <Users size={20} color={theme.colors.primary.default} />
          <span>{classroom.name}</span>
        </div>
        <Badge variant={classroom.codeCount > 0 ? 'primary' : 'neutral'}>
          {classroom.codeCount} {classroom.codeCount === 1 ? 'Code' : 'Codes'}
        </Badge>
      </div>

      <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginBottom: theme.spacing.sm }}>
        Erstellt am {new Date(classroom.createdAt).toLocaleDateString('de-DE')}
      </div>

      <div style={actionsStyles}>
        <Button size="sm" variant="primary" onClick={() => onGenerateCodes(classroom)}>
          <PlusCircle size={16} style={{ marginRight: theme.spacing.xs }} />
          Codes generieren
        </Button>
        {classroom.codeCount > 0 && (
          <>
            <Button size="sm" variant="outline" onClick={() => onPrintCodes(classroom)}>
              <Printer size={16} style={{ marginRight: theme.spacing.xs }} />
              Druckansicht
            </Button>
            {onOpenLiveMonitor && (
              <Button size="sm" variant="secondary" onClick={() => onOpenLiveMonitor(classroom)}>
                <Activity size={16} style={{ marginRight: theme.spacing.xs }} />
                Live-Monitor
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
