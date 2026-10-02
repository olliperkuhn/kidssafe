import React from 'react';
import { theme } from '../../styles/theme';
import { User } from 'lucide-react';

export interface TypingIndicatorProps {
  senderName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  senderName = 'Gegenüber',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: `${theme.spacing.xs} 0`,
        animation: 'messageSlideIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.secondary,
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <User size={14} color={theme.colors.secondary.default} />
        <span>{senderName} schreibt...</span>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.lg} 2px`,
          backgroundColor: theme.colors.neutral[100],
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.sm,
          minHeight: '40px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.secondary.default,
            display: 'inline-block',
            animation: 'typingBounce 1.2s infinite ease-in-out',
            animationDelay: '0s',
          }}
        />
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.secondary.default,
            display: 'inline-block',
            animation: 'typingBounce 1.2s infinite ease-in-out',
            animationDelay: '0.2s',
          }}
        />
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.secondary.default,
            display: 'inline-block',
            animation: 'typingBounce 1.2s infinite ease-in-out',
            animationDelay: '0.4s',
          }}
        />
      </div>
    </div>
  );
};
