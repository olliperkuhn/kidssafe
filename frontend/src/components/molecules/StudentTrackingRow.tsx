import React from 'react';
import { Card } from '../atoms/Card';
import { StatusDot } from '../atoms/StatusDot';
import { ProgressBar } from '../atoms/ProgressBar';
import { theme } from '../../styles/theme';
import { StudentTrackingItemDTO } from '../../types';
import { Tablet } from 'lucide-react';

export interface StudentTrackingRowProps {
  student: StudentTrackingItemDTO;
}

export const StudentTrackingRow: React.FC<StudentTrackingRowProps> = ({ student }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  };

  const labelBlockStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minWidth: '170px',
  };

  const iconStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: theme.borderRadius.md,
    backgroundColor: student.status === 'ONLINE' ? theme.colors.success.light : theme.colors.neutral[100],
    color: student.status === 'ONLINE' ? theme.colors.success.default : theme.colors.text.muted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const progressSectionStyles: React.CSSProperties = {
    flex: 1,
    minWidth: '200px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
  };

  const formatModuleName = (slug?: string): string => {
    if (!slug) return 'Kein Modul gestartet';
    if (slug.includes('phishing')) return 'Phishing Simulator';
    if (slug.includes('fake')) return 'Fake News Detektor';
    return slug;
  };

  return (
    <Card padding="md">
      <div style={containerStyles}>
        {/* Geräte-/Tier-Label & Code */}
        <div style={labelBlockStyles}>
          <div style={iconStyles}>
            <Tablet size={20} />
          </div>
          <div>
            <div style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
              {student.label}
            </div>
            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, letterSpacing: '0.05em' }}>
              {student.code}
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={{ minWidth: '110px' }}>
          <StatusDot status={student.status} />
          {student.status === 'ONLINE' && student.lastActiveSecondsAgo < 60 && (
            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
              vor {student.lastActiveSecondsAgo}s
            </div>
          )}
        </div>

        {/* Fortschritt (Security by Design: nur schrittweise Zählung, keine Antworten) */}
        <div style={progressSectionStyles}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: theme.typography.fontSize.xs }}>
            <span style={{ color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium }}>
              {formatModuleName(student.activeModule)}
            </span>
            <span style={{ color: theme.colors.text.muted }}>
              {student.totalScenarios > 0 ? `${student.completedScenarios}/${student.totalScenarios} Schritte` : 'Wartet auf Start'}
            </span>
          </div>
          <ProgressBar percent={student.progressPercent} showLabel />
        </div>
      </div>
    </Card>
  );
};
