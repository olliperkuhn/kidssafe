import React from 'react';
import { theme } from '../../styles/theme';
import { ShieldCheck, ArrowRight, Cloud, Cpu, HardDrive } from 'lucide-react';

export const AiCascadeBanner: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: theme.colors.primary.light,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        marginBottom: theme.spacing.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.primary.default,
            boxShadow: theme.shadows.sm,
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={22} />
        </div>
        <div>
          <h4 style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 }}>
            100% Schulstunden-Ausfallsicherheit (Automatische Kaskade)
          </h4>
          <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, margin: `${theme.spacing.xs} 0 0` }}>
            Fällt ein Cloud- oder GPU-Provider aus, schaltet Kidssafe nahtlos ohne Unterbrechung auf den nächsten Provider um.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.medium }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: theme.colors.surface, padding: '4px 8px', borderRadius: theme.borderRadius.sm }}>
          <Cloud size={14} color={theme.colors.secondary.default} /> Gemini
        </span>
        <ArrowRight size={14} color={theme.colors.text.muted} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: theme.colors.surface, padding: '4px 8px', borderRadius: theme.borderRadius.sm }}>
          <Cpu size={14} color={theme.colors.warning.default} /> Ollama
        </span>
        <ArrowRight size={14} color={theme.colors.text.muted} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: theme.colors.surface, padding: '4px 8px', borderRadius: theme.borderRadius.sm }}>
          <HardDrive size={14} color={theme.colors.success.default} /> Offline-Bibliothek
        </span>
      </div>
    </div>
  );
};
