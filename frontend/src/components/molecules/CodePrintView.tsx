import React from 'react';
import { Button } from '../atoms/Button';
import { theme } from '../../styles/theme';
import { InviteCodeDTO, ClassroomDTO } from '../../types';
import { Printer, ArrowLeft, Shield } from 'lucide-react';

export interface CodePrintViewProps {
  classroom: ClassroomDTO;
  codes: InviteCodeDTO[];
  onBack: () => void;
}

export const CodePrintView: React.FC<CodePrintViewProps> = ({ classroom, codes, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  };

  const cardStyles: React.CSSProperties = {
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: theme.spacing.xs,
  };

  const codeStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: '0.12em',
    color: theme.colors.primary.default,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: theme.spacing.xs }} />
          Zurück zur Übersicht
        </Button>
        <Button variant="primary" size="md" onClick={handlePrint}>
          <Printer size={18} style={{ marginRight: theme.spacing.xs }} />
          Kärtchen drucken
        </Button>
      </div>

      <div style={{ backgroundColor: theme.colors.neutral[50], padding: theme.spacing.md, borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` }}>
        <h3 style={{ fontSize: theme.typography.fontSize.md, color: theme.colors.text.primary }}>
          Druckbögen für {classroom.name} ({codes.length} Codes)
        </h3>
        <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
          Schneide diese Kärtchen entlang der gestrichelten Linien aus und verteile sie an die Schüler:innen für die iPad-Sitzung.
        </p>
      </div>

      <div style={gridStyles}>
        {codes.map((item) => (
          <div key={item.id} style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.text.secondary }}>
              <Shield size={16} color={theme.colors.primary.default} />
              <strong style={{ fontSize: theme.typography.fontSize.xs }}>Kidssafe • {classroom.name}</strong>
            </div>

            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
              Dein geheimer Zugangscode:
            </div>

            <div style={codeStyles}>{item.code}</div>

            {item.label && (
              <div
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary.hover,
                  backgroundColor: theme.colors.secondary.light,
                  padding: `2px ${theme.spacing.sm}`,
                  borderRadius: theme.borderRadius.full,
                  marginTop: theme.spacing.xs,
                }}
              >
                Gerät: {item.label}
              </div>
            )}

            <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
              Auf dem iPad eingeben & Mission starten
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
