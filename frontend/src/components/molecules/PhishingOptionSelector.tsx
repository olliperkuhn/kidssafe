import React from 'react';
import { theme } from '../../styles/theme';
import { PhishingOptionDTO } from '../../types';
import { MessageSquare } from 'lucide-react';

export interface PhishingOptionSelectorProps {
  options: PhishingOptionDTO[];
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

export const PhishingOptionSelector: React.FC<PhishingOptionSelectorProps> = ({
  options,
  onSelectOption,
  disabled = false,
}) => {
  if (options.length === 0) return null;

  return (
    <div style={{ marginTop: theme.spacing.md }}>
      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.sm,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
      >
        <MessageSquare size={18} color={theme.colors.primary.default} />
        <span>Wie reagierst du? Wähle deine Antwort:</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: theme.spacing.sm,
        }}
      >
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectOption(option.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: '14px 16px',
              minHeight: '64px',
              backgroundColor: disabled ? theme.colors.neutral[100] : theme.colors.surface,
              border: `2px solid ${disabled ? theme.colors.border : theme.colors.primary.light}`,
              borderRadius: theme.borderRadius.lg,
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: theme.shadows.sm,
              opacity: disabled ? 0.6 : 1,
              touchAction: 'manipulation',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = theme.colors.primary.default;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = theme.colors.primary.light;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.sm;
              }
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'scale(0.98)';
              }
            }}
            onMouseUp={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primary.default,
                color: theme.colors.primary.contrast,
                fontSize: '0.95rem',
                fontWeight: theme.typography.fontWeight.bold,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: theme.shadows.sm,
              }}
            >
              {index + 1}
            </span>
            <span
              style={{
                fontSize: '1rem', // Groß und deutlich lesbar für 4. Klässler (vorher 12px)
                lineHeight: 1.45,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.medium,
                flex: 1,
              }}
            >
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
