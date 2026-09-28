import React, { useRef, useEffect } from 'react';
import { theme } from '../../styles/theme';
import { PhishingStepResponseDTO } from '../../types';
import { ChatBubble } from '../molecules/ChatBubble';
import { PhishingOptionSelector } from '../molecules/PhishingOptionSelector';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { ArrowLeft, Search, AlertTriangle, ShieldCheck, Gamepad2 } from 'lucide-react';

export interface PhishingChatViewProps {
  data: PhishingStepResponseDTO;
  isTyping: boolean;
  onSelectOption: (optionId: string) => void;
  onOpenLeoReview: () => void;
  onExit: () => void;
}

export const PhishingChatView: React.FC<PhishingChatViewProps> = ({
  data,
  isTyping,
  onSelectOption,
  onOpenLeoReview,
  onExit,
}) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.messages, isTyping]);

  const isFinished = data.status === 'ESCALATED' || data.status === 'DEFENDED';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Kopfzeile mit Navigation und Fall-Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm, flexWrap: 'wrap', gap: theme.spacing.xs }}>
        <Button variant="outline" size="sm" onClick={onExit}>
          <ArrowLeft size={16} style={{ marginRight: theme.spacing.xs }} />
          Missions-Zentrale
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
          <Badge variant="primary">
            Fall {data.scenarioIndex + 1} von {data.totalScenarios}
          </Badge>
          <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            {data.scenarioTitle}
          </span>
        </div>
      </div>

      {/* Situations-Kontextbox */}
      <div
        style={{
          backgroundColor: theme.colors.primary.light,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.primary.hover,
          marginBottom: theme.spacing.sm,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
      >
        <Gamepad2 size={16} />
        <span>{data.scenarioContext}</span>
      </div>

      {/* Chat-Fenster (Messenger-Optik) */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          border: `1.5px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          minHeight: '340px',
          maxHeight: '440px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme.shadows.sm,
        }}
      >
        {data.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} attackerName={data.scenarioTitle} />
        ))}

        {isTyping && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              backgroundColor: theme.colors.neutral[100],
              borderRadius: theme.borderRadius.full,
              fontSize: '0.75rem',
              color: theme.colors.text.muted,
              fontStyle: 'italic',
              marginTop: theme.spacing.xs,
            }}
          >
            Nachricht wird empfangen...
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Interaktions-Zone */}
      {isFinished ? (
        <div
          style={{
            marginTop: theme.spacing.md,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: data.status === 'ESCALATED' ? theme.colors.danger.light : theme.colors.success.light,
            border: `2px solid ${data.status === 'ESCALATED' ? theme.colors.danger.default : theme.colors.success.default}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: theme.spacing.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            {data.status === 'ESCALATED' ? (
              <AlertTriangle size={24} color={theme.colors.danger.default} />
            ) : (
              <ShieldCheck size={24} color={theme.colors.success.default} />
            )}
            <div>
              <div style={{ fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.sm, color: data.status === 'ESCALATED' ? theme.colors.danger.default : theme.colors.success.default }}>
                {data.status === 'ESCALATED' ? '🚨 Phishing-Falle zugeschnappt!' : '🛡️ Super: Phishing abgewehrt!'}
              </div>
              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                {data.status === 'ESCALATED'
                  ? 'Der Chat wurde gestoppt. Untersuche jetzt mit Löwe Leo, woran man den Betrug erkennt.'
                  : 'Du hast richtig reagiert! Lass uns den Chat mit Löwe Leo genau analysieren.'}
              </div>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={onOpenLeoReview}>
            <Search size={16} style={{ marginRight: theme.spacing.xs }} />
            Mit Löwe Leo untersuchen
          </Button>
        </div>
      ) : (
        <PhishingOptionSelector
          options={data.options || []}
          onSelectOption={onSelectOption}
          disabled={isTyping}
        />
      )}
    </div>
  );
};
