import React, { useState } from 'react';
import { theme } from '../../../../styles/theme';
import { Button } from '../../../../components/atoms/Button';
import { LeoAvatar } from '../../../../components/atoms/LeoAvatar';
import { NewsArticleCard } from '../molecules/NewsArticleCard';
import { FactCheckInspector } from '../molecules/FactCheckInspector';
import { LeoFactCheckModal } from '../organisms/LeoFactCheckModal';
import { FactCheckCertificateCard } from '../organisms/FactCheckCertificateCard';
import { useFakeNewsSession } from '../../hooks/useFakeNewsSession';
import { ModuleProps } from '../../../types';
import { FakeNewsDifficulty } from '../../types';
import { ArrowLeft, CheckCircle2, AlertOctagon, Award, Play } from 'lucide-react';

export const FakeNewsModulePage: React.FC<ModuleProps> = ({
  session,
  onBack,
}) => {
  const {
    currentArticle,
    currentRound,
    totalRounds,
    score,
    lastVerdictResult,
    isLeoModalOpen,
    activeToolResult,
    isGameOver,
    summary,
    isLoading,
    isInspecting,
    isVoting,
    error,
    start,
    inspect,
    vote,
    closeLeoModal,
    reset,
  } = useFakeNewsSession(session.sessionToken);

  const [selectedDifficulty, setSelectedDifficulty] = useState<FakeNewsDifficulty>('JUNIOR');
  const [selectedCount, setSelectedCount] = useState<4 | 6>(4);

  // 1. Abschluss: Diplom anzeigen
  if (isGameOver && summary) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, padding: theme.spacing.xl }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={16} style={{ marginRight: theme.spacing.xs }} />
              Zurück zur Missionszentrale
            </Button>
          </div>
          <FactCheckCertificateCard
            summary={summary}
            studentCode={session.code}
            onRestart={reset}
          />
        </div>
      </div>
    );
  }

  // 2. Start-Bildschirm: Level- und Rundenauswahl
  if (!currentArticle) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, padding: theme.spacing.xl }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft size={16} style={{ marginRight: theme.spacing.xs }} />
              Zurück zur Übersicht
            </Button>
          </div>

          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.md,
              padding: theme.spacing.xl,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <LeoAvatar size="md" mood="detective" />
              <div>
                <h1 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 }}>
                  Fake News Detektor
                </h1>
                <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, margin: `${theme.spacing.xs} 0 0` }}>
                  Willkommen in der Fakten-Redaktion! Entlarve die Falschmeldungen.
                </p>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: theme.colors.danger.light, color: theme.colors.danger.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md }}>
                {error}
              </div>
            )}

            {/* Schwierigkeitsgrad */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ display: 'block', fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>
                Wähle deine Detektiv-Stufe:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('JUNIOR')}
                  style={{
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    border: selectedDifficulty === 'JUNIOR' ? `2px solid ${theme.colors.primary.default}` : `1px solid ${theme.colors.border}`,
                    backgroundColor: selectedDifficulty === 'JUNIOR' ? theme.colors.primary.light : theme.colors.surface,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary }}>
                    🦁 Junior-Detektiv
                  </strong>
                  <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                    Klasse 4–5: Skurrile Fakes & absurde Tiermeldungen
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('SENIOR')}
                  style={{
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    border: selectedDifficulty === 'SENIOR' ? `2px solid ${theme.colors.primary.default}` : `1px solid ${theme.colors.border}`,
                    backgroundColor: selectedDifficulty === 'SENIOR' ? theme.colors.primary.light : theme.colors.surface,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary }}>
                    🕵️ Senior-Detektiv
                  </strong>
                  <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                    Ab Klasse 6: Subtile Desinformation, Clickbait & Panik
                  </span>
                </button>
              </div>
            </div>

            {/* Runden-Auswahl */}
            <div style={{ marginBottom: theme.spacing.xl }}>
              <label style={{ display: 'block', fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>
                Anzahl der Nachrichten in dieser Mission:
              </label>
              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                {[4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedCount(num as 4 | 6)}
                    style={{
                      flex: 1,
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.md,
                      border: selectedCount === num ? `2px solid ${theme.colors.primary.default}` : `1px solid ${theme.colors.border}`,
                      backgroundColor: selectedCount === num ? theme.colors.primary.light : theme.colors.surface,
                      cursor: 'pointer',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: selectedCount === num ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular,
                    }}
                  >
                    {num} Meldungen {num === 4 ? '(Kurze Runde)' : '(Große Redaktionsrunde)'}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
              disabled={isLoading}
              onClick={() => start(selectedCount, selectedDifficulty)}
            >
              <Play size={18} style={{ marginRight: theme.spacing.xs }} />
              {isLoading ? 'Lade Fakten-Feed...' : 'Mission starten!'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Aktives Spiel: News prüfen & Abstimmen
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, padding: theme.spacing.lg }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
        {/* Spiel-Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: `${theme.spacing.sm} ${theme.spacing.md}`, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}` }}>
          <Button variant="outline" size="sm" onClick={reset}>
            <ArrowLeft size={14} style={{ marginRight: theme.spacing.xs }} /> Beenden
          </Button>

          <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            Meldung {currentRound} von {totalRounds}
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.warning.default }}>
            <Award size={16} /> {score} Punkte
          </span>
        </div>

        {/* Die zu prüfende News */}
        <NewsArticleCard article={currentArticle} />

        {/* Detektiv-Werkzeuge */}
        <FactCheckInspector
          onInspect={inspect}
          activeToolResult={activeToolResult}
          isInspecting={isInspecting}
        />

        {/* Großes Urteil-Panel */}
        <div style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}`, padding: theme.spacing.lg, textAlign: 'center' }}>
          <h3 style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
            Dein Detektiv-Urteil: Ist diese Nachricht echt oder fake?
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
            <button
              type="button"
              disabled={isVoting}
              onClick={() => vote('REAL')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.sm,
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.lg,
                border: `2px solid ${theme.colors.success.default}`,
                backgroundColor: theme.colors.success.light,
                color: theme.colors.success.default,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.bold,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <CheckCircle2 size={24} /> ECHT
            </button>

            <button
              type="button"
              disabled={isVoting}
              onClick={() => vote('FAKE')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.sm,
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.lg,
                border: `2px solid ${theme.colors.danger.default}`,
                backgroundColor: theme.colors.danger.light,
                color: theme.colors.danger.default,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.bold,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <AlertOctagon size={24} /> FAKE NEWS
            </button>
          </div>
        </div>
      </div>

      {/* Leo Faktencheck Auflösungs-Modal */}
      <LeoFactCheckModal
        isOpen={isLeoModalOpen}
        onClose={closeLeoModal}
        result={lastVerdictResult}
      />
    </div>
  );
};
