import React from 'react';
import { theme } from '../../styles/theme';
import { ChatMessageDTO } from '../../types';
import { LeoAvatar } from '../atoms/LeoAvatar';
import { User, ShieldAlert, Sparkles } from 'lucide-react';

export interface ChatBubbleProps {
  message: ChatMessageDTO;
  attackerName?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, attackerName = 'Unbekannt' }) => {
  const isStudent = message.sender === 'STUDENT';
  const isLeo = message.sender === 'LEO';

  if (isLeo) {
    return (
      <div
        style={{
          display: 'flex',
          gap: theme.spacing.sm,
          backgroundColor: theme.colors.warning.light,
          border: `2px solid ${theme.colors.warning.default}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          margin: `${theme.spacing.sm} 0`,
          boxShadow: theme.shadows.sm,
          animation: 'messageSlideIn 0.25s ease-out',
        }}
      >
        <LeoAvatar mood="detective" size="sm" />
        <div>
          <div
            style={{
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.bold,
              color: '#B45309',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
            }}
          >
            <Sparkles size={14} />
            Löwe Leo (Cyber-Detektiv):
          </div>
          <div
            style={{
              fontSize: '1rem',
              lineHeight: theme.typography.lineHeight.normal,
              color: theme.colors.text.primary,
              marginTop: '4px',
            }}
          >
            {message.text}
          </div>
        </div>
      </div>
    );
  }

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isStudent ? 'flex-end' : 'flex-start',
    margin: `${theme.spacing.xs} 0`,
    maxWidth: '100%',
    animation: 'messageSlideIn 0.25s ease-out',
  };

  const bubbleStyles: React.CSSProperties = {
    maxWidth: '85%',
    padding: `12px 18px`,
    borderRadius: isStudent
      ? `${theme.borderRadius.lg} ${theme.borderRadius.lg} 2px ${theme.borderRadius.lg}`
      : `${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.lg} 2px`,
    backgroundColor: isStudent
      ? theme.colors.primary.default
      : message.isWarningSignal
      ? theme.colors.danger.light
      : theme.colors.neutral[100],
    color: isStudent
      ? theme.colors.primary.contrast
      : message.isWarningSignal
      ? theme.colors.danger.default
      : theme.colors.text.primary,
    border: message.isWarningSignal
      ? `2px solid ${theme.colors.danger.default}`
      : `1px solid ${isStudent ? 'transparent' : theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    fontSize: '1.05rem', // Deutlich größer und kinderfreundlicher für 4. Klässler (vorher 14px)
    lineHeight: 1.55,
    wordBreak: 'break-word',
  };

  const metaStyles: React.CSSProperties = {
    fontSize: '0.8rem',
    color: theme.colors.text.muted,
    marginTop: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  return (
    <div style={containerStyles}>
      {!isStudent && (
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.secondary,
            marginBottom: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <User size={14} color={theme.colors.secondary.default} />
          {attackerName}
        </div>
      )}

      <div style={bubbleStyles}>
        {message.isWarningSignal && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: theme.typography.fontWeight.bold,
              fontSize: '0.85rem',
              marginBottom: '6px',
            }}
          >
            <ShieldAlert size={16} />
            {message.warningTitle || 'Warnung:'}
          </div>
        )}
        {message.text}
      </div>

      <div style={metaStyles}>
        <span>{message.timestamp}</span>
      </div>
    </div>
  );
};
