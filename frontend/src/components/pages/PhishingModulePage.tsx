import React, { useState } from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { PhishingChatView } from '../organisms/PhishingChatView';
import { LeoDetectiveReview } from '../organisms/LeoDetectiveReview';
import { PhishingCertificateCard } from '../organisms/PhishingCertificateCard';
import { LeoAvatar } from '../atoms/LeoAvatar';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { theme } from '../../styles/theme';
import { PhishingReviewDTO, PhishingStepResponseDTO } from '../../types';
import {
  startPhishingSession,
  replyToPhishing,
  nextPhishingScenario,
  fetchLeoReview,
} from '../../services/phishingApi';
import { useStudentHeartbeat } from '../../hooks/useStudentHeartbeat';
import { ModuleProps } from '../../modules/types';
import { Shield, Sparkles, Rocket, Zap, ArrowLeft, AlertCircle } from 'lucide-react';

export interface PhishingModulePageProps extends ModuleProps {
  onBackToDashboard?: () => void;
}

type ModuleStage = 'SETUP' | 'CHAT' | 'REVIEW' | 'CERTIFICATE';

export const PhishingModulePage: React.FC<PhishingModulePageProps> = ({
  session,
  onBack,
  onBackToDashboard,
  onLeaveSession,
}) => {
  const handleBack = onBack || onBackToDashboard || (() => {});
  const [stage, setStage] = useState<ModuleStage>('SETUP');
  const [selectedCaseCount, setSelectedCaseCount] = useState<3 | 5>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stepData, setStepData] = useState<PhishingStepResponseDTO | null>(null);
  const [leoReview, setLeoReview] = useState<PhishingReviewDTO | null>(null);

  // Sendet Live-Fortschritt an das Lehrer-Dashboard
  useStudentHeartbeat(
    {
      activeModule: 'Phishing Simulator',
      completedScenarios: stepData ? (stage === 'CERTIFICATE' ? stepData.totalScenarios : stepData.scenarioIndex) : 0,
      totalScenarios: stepData ? stepData.totalScenarios : selectedCaseCount,
    },
    session.sessionToken
  );

  const handleStartMission = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initialData = await startPhishingSession(selectedCaseCount);
      setStepData(initialData);
      setStage('CHAT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte Mission nicht starten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    if (!stepData) return;
    try {
      setIsTyping(true);
      setError(null);
      const nextData = await replyToPhishing(stepData.chatId, optionId);
      // Kurze Verzögerung für realistischen Chat-Effekt
      setTimeout(() => {
        setStepData(nextData);
        setIsTyping(false);
      }, 500);
    } catch (err) {
      setIsTyping(false);
      setError(err instanceof Error ? err.message : 'Antwort fehlgeschlagen');
    }
  };

  const handleOpenLeoReview = async () => {
    if (!stepData) return;
    try {
      setIsLoading(true);
      const review = await fetchLeoReview(stepData.chatId);
      setLeoReview(review);
      setStage('REVIEW');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte Leos Analyse nicht laden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedAfterReview = async () => {
    if (!stepData) return;
    const isLastScenario = stepData.scenarioIndex + 1 >= stepData.totalScenarios;
    if (isLastScenario) {
      setStage('CERTIFICATE');
      return;
    }

    try {
      setIsLoading(true);
      const nextData = await nextPhishingScenario(stepData.chatId);
      setStepData(nextData);
      setLeoReview(null);
      setStage('CHAT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nächstes Szenario fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout childSession={session} onLeaveChildSession={onLeaveSession}>
      {error && (
        <div style={{ backgroundColor: theme.colors.danger.light, color: theme.colors.danger.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* STUFE 1: EINSTELLUNGEN & WAHL DER ANZAHL */}
      {stage === 'SETUP' && (
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: theme.spacing.md }}>
            <LeoAvatar mood="friendly" size="xl" />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.xs, backgroundColor: theme.colors.primary.light, color: theme.colors.primary.default, padding: `4px ${theme.spacing.md}`, borderRadius: theme.borderRadius.full, fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold, marginBottom: theme.spacing.sm }}>
            <Sparkles size={16} />
            <span>KIDSSAFE MISSION: PHISHING-SIMULATOR</span>
          </div>

          <h1 style={{ fontSize: theme.typography.fontSize.xxl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.xs }}>
            Training mit Löwe Leo
          </h1>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginBottom: theme.spacing.xl }}>
            In dieser Simulation schreibt dir ein Angreifer im Chat. Wähle die klügste Antwort und entlarve mit Löwe Leo alle fiesen Tricks!
          </p>

          <Card padding="lg" style={{ marginBottom: theme.spacing.xl, textAlign: 'left' }}>
            <h3 style={{ fontSize: theme.typography.fontSize.md, color: theme.colors.text.primary, marginBottom: theme.spacing.sm, display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
              <Shield size={18} color={theme.colors.primary.default} />
              <span>Wähle deinen Trainings-Umfang:</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginTop: theme.spacing.md }}>
              <button
                type="button"
                onClick={() => setSelectedCaseCount(3)}
                style={{
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  border: `2px solid ${selectedCaseCount === 3 ? theme.colors.primary.default : theme.colors.border}`,
                  backgroundColor: selectedCaseCount === 3 ? theme.colors.primary.light : theme.colors.surface,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary.default, fontSize: theme.typography.fontSize.sm }}>
                  <Zap size={16} />
                  <span>3 Fälle (ca. 10 Min)</span>
                </div>
                <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, marginTop: '4px' }}>
                  Ideal für eine schnelle iPad-Runde im Unterricht.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCaseCount(5)}
                style={{
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  border: `2px solid ${selectedCaseCount === 5 ? theme.colors.primary.default : theme.colors.border}`,
                  backgroundColor: selectedCaseCount === 5 ? theme.colors.primary.light : theme.colors.surface,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary.default, fontSize: theme.typography.fontSize.sm }}>
                  <Sparkles size={16} />
                  <span>5 Fälle (ca. 18 Min)</span>
                </div>
                <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, marginTop: '4px' }}>
                  Die Meister-Mission inklusive Paket- & Freund-Trick.
                </div>
              </button>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md }}>
            <Button variant="outline" size="md" onClick={handleBack}>
              <ArrowLeft size={18} style={{ marginRight: theme.spacing.xs }} />
              Zurück
            </Button>
            <Button variant="primary" size="lg" disabled={isLoading} onClick={handleStartMission}>
              <Rocket size={18} style={{ marginRight: theme.spacing.xs }} />
              {isLoading ? 'Bereite Fälle vor...' : 'Mission starten!'}
            </Button>
          </div>
        </div>
      )}

      {/* STUFE 2: DER INTERAKTIVE CHAT */}
      {stage === 'CHAT' && stepData && (
        <PhishingChatView
          data={stepData}
          isTyping={isTyping}
          onSelectOption={handleSelectOption}
          onOpenLeoReview={handleOpenLeoReview}
          onExit={handleBack}
        />
      )}

      {/* STUFE 3: LÖWE LEOS DETEKTIV-ANALYSE */}
      {stage === 'REVIEW' && leoReview && stepData && (
        <LeoDetectiveReview
          review={leoReview}
          hasNextScenario={stepData.scenarioIndex + 1 < stepData.totalScenarios}
          onProceed={handleProceedAfterReview}
        />
      )}

      {/* STUFE 4: DIE ABSCHLUSS-URKUNDE */}
      {stage === 'CERTIFICATE' && (
        <PhishingCertificateCard
          studentLabel={session.label || session.code}
          scenarioCount={selectedCaseCount}
          onFinish={handleBack}
        />
      )}
    </BaseLayout>
  );
};
