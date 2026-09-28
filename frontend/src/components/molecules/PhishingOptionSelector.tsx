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
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.xs,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
      >
        <MessageSquare size={14} color={theme.colors.primary.default} />
        <span>Wie reagierst du auf diese Nachricht? Wähle eine Antwort:</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
              alignItems: 'flex-start',
              gap: theme.spacing.sm,
              padding: theme.spacing.sm,
              backgroundColor: disabled ? theme.colors.neutral[100] : theme.colors.surface,
              border: `2px solid ${disabled ? theme.colors.border : theme.colors.primary.light}`,
              borderRadius: theme.borderRadius.md,
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: theme.shadows.sm,
              opacity: disabled ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = theme.colors.primary.default;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = theme.colors.primary.light;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primary.default,
                color: theme.colors.primary.contrast,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {index + 1}
            </span>
            <span
              style={{
                fontSize: theme.typography.fontSize.xs,
                lineHeight: theme.typography.lineHeight.normal,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.medium,
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
