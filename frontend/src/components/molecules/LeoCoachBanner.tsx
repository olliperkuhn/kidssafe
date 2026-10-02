import React from 'react';
import { theme } from '../../styles/theme';
import { LeoAvatar, LeoMood } from '../atoms/LeoAvatar';
import { ChatStatus } from '../../types';
import { Sparkles } from 'lucide-react';

export interface LeoCoachBannerProps {
  status: ChatStatus;
  isTyping: boolean;
  step: number;
}

export const LeoCoachBanner: React.FC<LeoCoachBannerProps> = ({
  status,
  isTyping,
  step,
}) => {
  let mood: LeoMood = 'detective';
  let animation: 'none' | 'pulse' | 'think' = 'none';
  let title = 'Dein Cyber-Detektiv Leo ist an Bord';
  let message = 'Schau dir die Nachricht genau an. Erkennst du verdächtige Zeichen?';

  if (isTyping) {
    mood = 'thinking';
    animation = 'think';
    title = 'Löwe Leo spitzt die Ohren...';
    message = 'Ich lese aufmerksam mit. Mal sehen, welche Masche der Absender jetzt versucht!';
  } else if (status === 'DEFENDED') {
    mood = 'celebrating';
    title = 'Stark! Angriff abgewehrt!';
    message = 'Du hast dich nicht reinlegen lassen! Lass uns den Fall zusammen mit der Lupe untersuchen.';
  } else if (status === 'ESCALATED') {
    mood = 'warning';
    animation = 'pulse';
    title = 'Falle zugeschnappt – keine Panik!';
    message = 'Auch Meister-Detektive lernen aus Fehlern! Schauen wir uns an, wo der Trick versteckt war.';
  } else if (step === 2) {
    mood = 'detective';
    title = 'Achtung, zweite Runde!';
    message = 'Der Absender hakt nach! Bleib standhaft und lass dich nicht unter Druck setzen.';
  }

  const bgColor = status === 'DEFENDED'
    ? theme.colors.success.light
    : status === 'ESCALATED'
    ? theme.colors.danger.light
    : theme.colors.warning.light;

  const borderColor = status === 'DEFENDED'
    ? theme.colors.success.default
    : status === 'ESCALATED'
    ? theme.colors.danger.default
    : theme.colors.warning.default;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.sm,
        marginBottom: theme.spacing.sm,
        transition: 'all 0.3s ease',
      }}
    >
      <LeoAvatar mood={mood} size="sm" animation={animation} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles size={14} color={lionBadgeColor(mood)} />
          <span>{title}</span>
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            color: theme.colors.text.secondary,
            marginTop: '1px',
            lineHeight: theme.typography.lineHeight.normal,
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

function lionBadgeColor(mood: LeoMood): string {
  switch (mood) {
    case 'celebrating':
      return theme.colors.success.default;
    case 'warning':
      return theme.colors.danger.default;
    case 'thinking':
    case 'detective':
      return theme.colors.warning.default;
    default:
      return theme.colors.primary.default;
  }
}
