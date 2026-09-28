import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { Button } from '../atoms/Button';
import { AiCascadeBanner } from '../molecules/AiCascadeBanner';
import { AiProviderCard } from '../molecules/AiProviderCard';
import { AiSettingsModal } from './AiSettingsModal';
import { AiPlaygroundCard } from './AiPlaygroundCard';
import { useAiAdmin } from '../../hooks/useAiAdmin';
import { Sliders, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export interface AiManagementViewProps {
  token: string;
}

export const AiManagementView: React.FC<AiManagementViewProps> = ({ token }) => {
  const {
    status,
    isLoading,
    isSaving,
    isTesting,
    testResult,
    error,
    successMessage,
    loadStatus,
    setActiveProvider,
    saveConfig,
    executeTest,
    clearTestResult,
  } = useAiAdmin(token);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getModelInfo = (providerId: string): string | undefined => {
    if (!status) return undefined;
    if (providerId === 'gemini') return status.models.gemini.model;
    if (providerId === 'ollama') return `${status.models.ollama.model} (${status.models.ollama.baseUrl})`;
    if (providerId === 'mock') return '5 kuratierte Szenarien (727 Zeilen)';
    return undefined;
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, flexWrap: 'wrap', gap: theme.spacing.md }}>
        <div>
          <h2 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 }}>
            KI-Pipeline & Sprachmodelle
          </h2>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, margin: `${theme.spacing.xs} 0 0` }}>
            Verwalte Cloud- und lokale Sprachmodelle mit integriertem Ausfallschutz für den Schulunterricht.
          </p>
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button variant="outline" size="sm" onClick={loadStatus} disabled={isLoading}>
            <RefreshCw size={16} style={{ marginRight: theme.spacing.xs }} className={isLoading ? 'animate-spin' : ''} />
            Status aktualisieren
          </Button>

          <Button variant="primary" size="sm" onClick={() => setIsSettingsOpen(true)}>
            <Sliders size={16} style={{ marginRight: theme.spacing.xs }} />
            Verbindungseinstellungen
          </Button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div style={{ backgroundColor: theme.colors.success.light, color: theme.colors.success.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, display: 'flex', alignItems: 'center', gap: theme.spacing.sm, fontSize: theme.typography.fontSize.sm }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: theme.colors.danger.light, color: theme.colors.danger.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, display: 'flex', alignItems: 'center', gap: theme.spacing.sm, fontSize: theme.typography.fontSize.sm }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Failover Cascade Banner */}
      <AiCascadeBanner />

      {/* Provider Cards Grid */}
      {isLoading && !status ? (
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl, color: theme.colors.text.muted }}>
          Lade Provider-Status...
        </div>
      ) : status ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: theme.spacing.lg }}>
          {status.providers.map((p) => (
            <AiProviderCard
              key={p.id}
              provider={p}
              isActive={status.activeProvider === p.id}
              modelInfo={getModelInfo(p.id)}
              isSaving={isSaving}
              onActivate={setActiveProvider}
            />
          ))}
        </div>
      ) : null}

      {/* Interactive Playground & Diagnosis */}
      <AiPlaygroundCard
        isTesting={isTesting}
        testResult={testResult}
        onExecuteTest={executeTest}
        onClearResult={clearTestResult}
      />

      {/* Settings Modal */}
      <AiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={status}
        isSaving={isSaving}
        onSave={saveConfig}
      />
    </div>
  );
};
