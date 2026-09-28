import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { TestAiPromptDTO, TestAiPromptResponseDTO, AIProviderId } from '../../types';
import { Terminal, Play, Sparkles, Shield, MessageSquare, Clock } from 'lucide-react';

export interface AiPlaygroundCardProps {
  isTesting: boolean;
  testResult: TestAiPromptResponseDTO | null;
  onExecuteTest: (payload: TestAiPromptDTO) => void;
  onClearResult: () => void;
}

export const AiPlaygroundCard: React.FC<AiPlaygroundCardProps> = ({
  isTesting,
  testResult,
  onExecuteTest,
  onClearResult,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProviderId | 'active'>('active');
  const [promptPreset, setPromptPreset] = useState<'ATTACKER' | 'LEO' | 'CUSTOM'>('ATTACKER');
  const [customPrompt, setCustomPrompt] = useState('Erkläre einem Viertklässler, warum man niemals Passwörter im Chat teilen darf.');

  const handleRunPreset = (preset: 'ATTACKER' | 'LEO' | 'CUSTOM') => {
    setPromptPreset(preset);
    const providerParam = selectedProvider === 'active' ? undefined : selectedProvider;

    if (preset === 'ATTACKER') {
      onExecuteTest({
        provider: providerParam,
        systemPrompt: 'Du bist ein didaktischer KI-Simulator für IT-Sicherheit an Grundschulen. Rolle: Angreifer.',
        userPrompt: 'Szenario: Roblox Gratis-Guthaben. Kind hat gezögert. Antworte als Angreifer mit Lockangebot und 4 Optionen.',
        responseJson: true,
      });
    } else if (preset === 'LEO') {
      onExecuteTest({
        provider: providerParam,
        systemPrompt: 'Du bist Löwe Leo, der kinderfreundliche Cyber-Detektiv.',
        userPrompt: 'Erstelle eine kurze Nachbesprechung mit Warnsignalen und Leitsatz für den Roblox-Fall.',
        responseJson: true,
      });
    } else {
      onExecuteTest({
        provider: providerParam,
        systemPrompt: 'Du bist ein kindgerechter Sicherheitsassistent für die 4. Klasse.',
        userPrompt: customPrompt,
        responseJson: false,
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,
        padding: theme.spacing.lg,
        marginTop: theme.spacing.xl,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md, flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <Terminal size={20} color={theme.colors.primary.default} />
          <h3 style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 }}>
            Live-KI-Diagnose & Test-Konsole
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>Provider:</span>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as AIProviderId | 'active')}
            style={{
              padding: '4px 8px',
              borderRadius: theme.borderRadius.sm,
              border: `1px solid ${theme.colors.border}`,
              fontSize: theme.typography.fontSize.xs,
              backgroundColor: theme.colors.neutral[50],
            }}
          >
            <option value="active">Kaskade / Aktiver Provider</option>
            <option value="gemini">Google Gemini Flash</option>
            <option value="ollama">Lokales Ollama</option>
            <option value="mock">Didaktischer Fallback</option>
          </select>
        </div>
      </div>

      <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, margin: `0 0 ${theme.spacing.md} 0` }}>
        Führe direkte Test-Anfragen durch, um die Latenz und das Antwortverhalten der aktiven KI-Pipeline im Klassenzimmer zu überprüfen.
      </p>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: theme.spacing.sm, marginBottom: theme.spacing.md, flexWrap: 'wrap' }}>
        <Button
          variant={promptPreset === 'ATTACKER' ? 'primary' : 'outline'}
          size="sm"
          disabled={isTesting}
          onClick={() => handleRunPreset('ATTACKER')}
        >
          <Sparkles size={14} style={{ marginRight: theme.spacing.xs }} /> 1. Angreifer-Test (JSON)
        </Button>
        <Button
          variant={promptPreset === 'LEO' ? 'primary' : 'outline'}
          size="sm"
          disabled={isTesting}
          onClick={() => handleRunPreset('LEO')}
        >
          <Shield size={14} style={{ marginRight: theme.spacing.xs }} /> 2. Löwe Leo Test (Review)
        </Button>
        <Button
          variant={promptPreset === 'CUSTOM' ? 'primary' : 'outline'}
          size="sm"
          disabled={isTesting}
          onClick={() => setPromptPreset('CUSTOM')}
        >
          <MessageSquare size={14} style={{ marginRight: theme.spacing.xs }} /> 3. Freitext-Prompt
        </Button>
      </div>

      {/* Freitext-Eingabe falls gewählt */}
      {promptPreset === 'CUSTOM' && (
        <div style={{ marginBottom: theme.spacing.md, display: 'flex', gap: theme.spacing.sm }}>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              fontSize: theme.typography.fontSize.sm,
            }}
            placeholder="Prompt eingeben..."
          />
          <Button variant="primary" size="sm" disabled={isTesting} onClick={() => handleRunPreset('CUSTOM')}>
            <Play size={14} style={{ marginRight: theme.spacing.xs }} /> Senden
          </Button>
        </div>
      )}

      {/* Testergebnis / Konsole */}
      {isTesting ? (
        <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.text.muted, backgroundColor: theme.colors.neutral[50], borderRadius: theme.borderRadius.md }}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: theme.spacing.xs }}>⏳</div>
          <p style={{ margin: 0, fontSize: theme.typography.fontSize.sm }}>Sende Anfrage an KI-Pipeline...</p>
        </div>
      ) : testResult ? (
        <div style={{ backgroundColor: theme.colors.neutral[900], borderRadius: theme.borderRadius.md, padding: theme.spacing.md, color: theme.colors.neutral[100] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm, borderBottom: `1px solid ${theme.colors.neutral[700]}`, paddingBottom: theme.spacing.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <Badge variant="success">Ausgeführt durch: {testResult.providerUsed}</Badge>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: theme.typography.fontSize.xs, color: theme.colors.neutral[400] }}>
                <Clock size={12} /> {testResult.latencyMs} ms
              </span>
            </div>
            <button
              onClick={onClearResult}
              style={{ background: 'none', border: 'none', color: theme.colors.neutral[400], cursor: 'pointer', fontSize: theme.typography.fontSize.xs }}
            >
              Schließen
            </button>
          </div>
          <pre style={{ margin: 0, fontSize: theme.typography.fontSize.xs, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '240px', overflowY: 'auto' }}>
            {testResult.response}
          </pre>
        </div>
      ) : null}
    </div>
  );
};
