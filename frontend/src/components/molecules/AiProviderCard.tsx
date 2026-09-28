import React from 'react';
import { theme } from '../../styles/theme';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ProviderHealthDTO, AIProviderId } from '../../types';
import { Cloud, Cpu, ShieldCheck, Check, Activity, AlertCircle } from 'lucide-react';

export interface AiProviderCardProps {
  provider: ProviderHealthDTO;
  isActive: boolean;
  modelInfo?: string;
  isSaving?: boolean;
  onActivate: (providerId: AIProviderId) => void;
}

export const AiProviderCard: React.FC<AiProviderCardProps> = ({
  provider,
  isActive,
  modelInfo,
  isSaving = false,
  onActivate,
}) => {
  const getIcon = () => {
    switch (provider.id) {
      case 'gemini':
        return <Cloud size={24} color={theme.colors.secondary.default} />;
      case 'ollama':
        return <Cpu size={24} color={theme.colors.warning.default} />;
      case 'mock':
      default:
        return <ShieldCheck size={24} color={theme.colors.primary.default} />;
    }
  };

  const getStatusBadge = () => {
    if (isActive) {
      return <Badge variant="success">Aktiv</Badge>;
    }
    if (provider.isAvailable) {
      return <Badge variant="primary">Bereit (Standby)</Badge>;
    }
    if (!provider.isConfigured) {
      return <Badge variant="warning">Nicht eingerichtet</Badge>;
    }
    return <Badge variant="danger">Offline</Badge>;
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        border: isActive
          ? `2px solid ${theme.colors.success.default}`
          : `1px solid ${theme.colors.border}`,
        boxShadow: isActive ? theme.shadows.md : theme.shadows.sm,
        padding: theme.spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.neutral[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getIcon()}
            </div>
            <div>
              <h3 style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 }}>
                {provider.name}
              </h3>
              {modelInfo && (
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
                  Modell: {modelInfo}
                </span>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Latenz & Diagnose-Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, margin: `${theme.spacing.sm} 0 ${theme.spacing.md}` }}>
          {provider.latencyMs !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
              <Activity size={14} color={provider.isAvailable ? theme.colors.success.default : theme.colors.danger.default} />
              <span>Latenz: {provider.latencyMs} ms</span>
            </div>
          )}

          {provider.error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.danger.default }}>
              <AlertCircle size={14} />
              <span title={provider.error}>{provider.error.length > 35 ? `${provider.error.substring(0, 32)}...` : provider.error}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.colors.neutral[100]}` }}>
        {isActive ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, color: theme.colors.success.default, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, padding: `${theme.spacing.xs} 0` }}>
            <Check size={16} /> Primärer Provider
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            style={{ width: '100%' }}
            disabled={!provider.isAvailable || isSaving}
            onClick={() => onActivate(provider.id)}
          >
            Als primär aktivieren
          </Button>
        )}
      </div>
    </div>
  );
};
