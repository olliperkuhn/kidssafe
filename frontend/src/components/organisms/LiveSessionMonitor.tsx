import React, { useState } from 'react';
import { StudentTrackingRow } from '../molecules/StudentTrackingRow';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { theme } from '../../styles/theme';
import { ClassroomTrackingResponseDTO } from '../../types';
import { ArrowLeft, RefreshCw, Radio, Pause, Play, ShieldAlert } from 'lucide-react';

export interface LiveSessionMonitorProps {
  data: ClassroomTrackingResponseDTO;
  isPolling: boolean;
  onTogglePolling: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

export const LiveSessionMonitor: React.FC<LiveSessionMonitorProps> = ({
  data,
  isPolling,
  onTogglePolling,
  onRefresh,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = data.students.filter(
    (s) =>
      s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Oberer Navigationsbalken */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, flexWrap: 'wrap', gap: theme.spacing.md }}>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: theme.spacing.xs }} />
          Zurück zur Klassenübersicht
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <Badge variant={isPolling ? 'success' : 'neutral'}>
            <Radio size={14} style={{ marginRight: theme.spacing.xs }} />
            {isPolling ? 'Live (alle 6s)' : 'Pausiert'}
          </Badge>
          <Button size="sm" variant="outline" onClick={onTogglePolling}>
            {isPolling ? <Pause size={14} /> : <Play size={14} />}
          </Button>
          <Button size="sm" variant="outline" onClick={onRefresh} title="Manuell aktualisieren">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      {/* KPI-Statistikkarten */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <Card padding="md">
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>Klasse</div>
          <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            {data.classroomName}
          </div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>{data.totalCodes} Codes hinterlegt</div>
        </Card>

        <Card padding="md">
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>Aktive iPads</div>
          <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.success.default }}>
            {data.activeCodes} / {data.totalCodes}
          </div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>arbeiten gerade an Missionen</div>
        </Card>

        <Card padding="md">
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>Abgeschlossen</div>
          <div style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.secondary.default }}>
            {data.completedCodes}
          </div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>fertige Durchläufe</div>
        </Card>
      </div>

      {/* Datenschutzhinweis */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, backgroundColor: theme.colors.neutral[100], padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.lg, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
        <ShieldAlert size={16} />
        <span>Datenschutzgarantie: Es werden ausschließlich Aktivitätszeiten und Schrittzähler erfasst. Es werden keine Schülerantworten oder Noten gespeichert.</span>
      </div>

      {/* Suchleiste */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nach iPad oder Code filtern (z. B. iPad 03 oder SAFE)..."
          style={{
            width: '100%',
            maxWidth: '350px',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.fontSize.sm,
            borderRadius: theme.borderRadius.md,
            border: `1.5px solid ${theme.colors.border}`,
            outline: 'none',
          }}
        />
      </div>

      {/* Liste der Schüler-Sitzungen */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.text.muted }}>
            Keine passenden Codes gefunden.
          </div>
        ) : (
          filteredStudents.map((student) => <StudentTrackingRow key={student.codeId} student={student} />)
        )}
      </div>
    </div>
  );
};
