import React from 'react';
import { theme } from '../../../../styles/theme';
import { Button } from '../../../../components/atoms/Button';
import { FactCheckToolType, InspectToolResultDTO } from '../../types';
import { Search, Scale, MessageSquareWarning, HelpCircle } from 'lucide-react';

export interface FactCheckInspectorProps {
  onInspect: (toolType: FactCheckToolType) => void;
  activeToolResult: InspectToolResultDTO | null;
  isInspecting: boolean;
}

export const FactCheckInspector: React.FC<FactCheckInspectorProps> = ({
  onInspect,
  activeToolResult,
  isInspecting,
}) => {
  const getSuspiciousColor = (rating?: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (rating) {
      case 'HIGH':
        return { bg: theme.colors.danger.light, text: theme.colors.danger.default, label: 'Sehr verdächtig ⚠️' };
      case 'MEDIUM':
        return { bg: theme.colors.warning.light, text: theme.colors.warning.default, label: 'Auffällig 🧐' };
      case 'LOW':
      default:
        return { bg: theme.colors.success.light, text: theme.colors.success.default, label: 'Unauffällig ✅' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.neutral[50],
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.lg,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
        <HelpCircle size={18} color={theme.colors.primary.default} />
        <h4 style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 }}>
          Detektiv-Werkzeuge: Nutze die Faktencheck-Lupe vor deiner Entscheidung!
        </h4>
      </div>

      {/* Buttons für Werkzeuge */}
      <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap', marginBottom: activeToolResult ? theme.spacing.md : 0 }}>
        <Button
          variant="outline"
          size="sm"
          disabled={isInspecting}
          onClick={() => onInspect('SOURCE_CHECK')}
        >
          <Search size={14} style={{ marginRight: theme.spacing.xs }} />
          1. Quellencheck
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isInspecting}
          onClick={() => onInspect('PLAUSIBILITY_CHECK')}
        >
          <Scale size={14} style={{ marginRight: theme.spacing.xs }} />
          2. Plausibilitäts-Check
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isInspecting}
          onClick={() => onInspect('LANGUAGE_CHECK')}
        >
          <MessageSquareWarning size={14} style={{ marginRight: theme.spacing.xs }} />
          3. Sprach-Check
        </Button>
      </div>

      {/* Ergebnis-Karte */}
      {isInspecting && (
        <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginTop: theme.spacing.sm }}>
          Untersuche Meldung mit Detektiv-Werkzeugen...
        </div>
      )}

      {activeToolResult && !isInspecting && (
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs }}>
            <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
              {activeToolResult.title}
            </span>
            <span
              style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold,
                padding: '2px 8px',
                borderRadius: theme.borderRadius.full,
                backgroundColor: getSuspiciousColor(activeToolResult.suspiciousRating).bg,
                color: getSuspiciousColor(activeToolResult.suspiciousRating).text,
              }}
            >
              {getSuspiciousColor(activeToolResult.suspiciousRating).label}
            </span>
          </div>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, margin: 0 }}>
            {activeToolResult.hint}
          </p>
        </div>
      )}
    </div>
  );
};
