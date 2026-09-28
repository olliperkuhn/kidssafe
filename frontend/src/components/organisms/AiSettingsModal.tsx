import React, { useState, useEffect } from 'react';
import { theme } from '../../styles/theme';
import { Modal } from '../atoms/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { AiStatusResponseDTO, UpdateAiConfigDTO } from '../../types';
import { Eye, EyeOff, Sliders, Cloud, Cpu } from 'lucide-react';

export interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: AiStatusResponseDTO | null;
  isSaving: boolean;
  onSave: (payload: UpdateAiConfigDTO) => Promise<boolean>;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  status,
  isSaving,
  onSave,
}) => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('gemma2:2b');
  const [temperature, setTemperature] = useState(0.7);

  useEffect(() => {
    if (status) {
      setGeminiModel(status.models.gemini.model || 'gemini-1.5-flash');
      setOllamaUrl(status.models.ollama.baseUrl || 'http://localhost:11434');
      setOllamaModel(status.models.ollama.model || 'gemma2:2b');
      setTemperature(status.temperature ?? 0.7);
    }
  }, [status, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateAiConfigDTO = {
      temperature,
      gemini: {
        model: geminiModel,
        ...(geminiApiKey.trim() ? { apiKey: geminiApiKey.trim() } : {}),
      },
      ollama: {
        baseUrl: ollamaUrl.trim(),
        model: ollamaModel.trim(),
      },
    };

    const success = await onSave(payload);
    if (success) {
      setGeminiApiKey('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="KI-Pipeline & Provider Konfiguration">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
        {/* Google Gemini Sektion */}
        <div style={{ backgroundColor: theme.colors.neutral[50], padding: theme.spacing.md, borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm, color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.semibold }}>
            <Cloud size={18} color={theme.colors.secondary.default} /> Google Gemini Flash (Cloud-Flaggschiff)
          </div>
          
          <div style={{ position: 'relative', marginBottom: theme.spacing.sm }}>
            <Input
              label={`API-Key ${status?.models.gemini.apiKeyConfigured ? '(bereits konfiguriert)' : ''}`}
              type={showApiKey ? 'text' : 'password'}
              placeholder={status?.models.gemini.apiKeyMasked || 'AIzaSy... eingeben zum Ändern'}
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '32px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.colors.text.muted,
              }}
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.secondary, marginBottom: theme.spacing.xs }}>
              Modell-Version
            </label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.surface,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash (Empfohlen: schnell & didaktisch)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (Neueste Generation)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (Größeres Modell)</option>
            </select>
          </div>
        </div>

        {/* Lokales Ollama Sektion */}
        <div style={{ backgroundColor: theme.colors.neutral[50], padding: theme.spacing.md, borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm, color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.semibold }}>
            <Cpu size={18} color={theme.colors.warning.default} /> Lokales Ollama (Open-Source / Offline)
          </div>
          
          <div style={{ marginBottom: theme.spacing.sm }}>
            <Input
              label="Ollama Server URL"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              required
            />
          </div>

          <Input
            label="Modellname"
            value={ollamaModel}
            onChange={(e) => setOllamaModel(e.target.value)}
            placeholder="gemma2:2b oder qwen2.5:3b"
            required
          />
        </div>

        {/* Temperatur-Regler */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
              <Sliders size={16} /> Modell-Temperatur (Kreativität): {temperature.toFixed(2)}
            </label>
            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
              {temperature < 0.4 ? 'Deterministisch / Streng' : temperature > 0.8 ? 'Sehr kreativ' : 'Ausgewogen (Didaktisch optimal)'}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.2"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
            Abbrechen
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Speichern...' : 'Einstellungen übernehmen'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
