import React, { useRef, useEffect } from 'react';
import { theme } from '../../styles/theme';
import { PhishingStepResponseDTO } from '../../types';
import { ChatBubble } from '../molecules/ChatBubble';
import { TypingIndicator } from '../molecules/TypingIndicator';
import { LeoCoachBanner } from '../molecules/LeoCoachBanner';
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
  const currentStep = data.messages.filter((m) => m.sender === 'STUDENT').length + 1;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Kopfzeile mit Navigation und Fall-Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs, flexWrap: 'wrap', gap: theme.spacing.xs }}>
        <Button variant="outline" size="sm" onClick={onExit}>
          <ArrowLeft size={16} style={{ marginRight: theme.spacing.xs }} />
          Missions-Zentrale
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
          <Badge variant="primary">
            Fall {data.scenarioIndex + 1} von {data.totalScenarios}
          </Badge>
          {data.providerUsed && data.providerUsed !== 'mock' ? (
            <Badge variant="success">✨ Live-KI ({data.providerUsed})</Badge>
          ) : (
            <Badge variant="neutral">📚 Offline-Modus</Badge>
          )}
          <span style={{ fontSize: '0.95rem', fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            {data.scenarioTitle}
          </span>
        </div>
      </div>

      {/* Situations-Kontextbox (Kindgerecht vergrößert) */}
      <div
        style={{
          backgroundColor: theme.colors.primary.light,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.md,
          fontSize: '0.85rem',
          color: theme.colors.primary.hover,
          marginBottom: theme.spacing.xs,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
      >
        <Gamepad2 size={18} />
        <span>{data.scenarioContext}</span>
      </div>

      {/* Löwe Leo als aktiver Begleiter & Coach */}
      <LeoCoachBanner
        status={data.status}
        isTyping={isTyping}
        step={currentStep}
      />

      {/* Chat-Fenster (Messenger-Optik mit vergrößerten Texten) */}
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

        {/* Animierter Tipp-Indikator während Lade-/KI-Zeiten */}
        {isTyping && <TypingIndicator senderName={data.scenarioTitle} />}

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
            animation: 'popIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            {data.status === 'ESCALATED' ? (
              <AlertTriangle size={32} color={theme.colors.danger.default} />
            ) : (
              <ShieldCheck size={32} color={theme.colors.success.default} />
            )}
            <div>
              <div
                style={{
                  fontWeight: theme.typography.fontWeight.bold,
                  fontSize: '1.05rem',
                  color: data.status === 'ESCALATED' ? theme.colors.danger.default : theme.colors.success.default,
                }}
              >
                {data.status === 'ESCALATED' ? '🚨 Phishing-Falle zugeschnappt!' : '🛡️ Super: Phishing abgewehrt!'}
              </div>
              <div style={{ fontSize: '0.9rem', color: theme.colors.text.secondary, marginTop: '2px' }}>
                {data.status === 'ESCALATED'
                  ? 'Der Chat wurde gestoppt. Untersuche jetzt mit Löwe Leo, woran man den Betrug erkennt.'
                  : 'Du hast richtig reagiert! Lass uns den Chat mit Löwe Leo genau analysieren.'}
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={onOpenLeoReview}>
            <Search size={18} style={{ marginRight: theme.spacing.xs }} />
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
