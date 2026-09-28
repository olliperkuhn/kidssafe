import React from 'react';
import { theme } from '../../../../styles/theme';
import { Modal } from '../../../../components/atoms/Modal';
import { Button } from '../../../../components/atoms/Button';
import { LeoAvatar } from '../../../../components/atoms/LeoAvatar';
import { VerdictPill } from '../atoms/VerdictPill';
import { VerdictResultDTO } from '../../types';
import { Award, Sparkles, BookOpen } from 'lucide-react';

export interface LeoFactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: VerdictResultDTO | null;
}

export const LeoFactCheckModal: React.FC<LeoFactCheckModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!result) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={result.isCorrect ? 'Richtig entlarvt! 🎉' : 'Faktencheck-Auflösung 🦁'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
        {/* Leo Avatar & Begrüßung */}
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <LeoAvatar
            size="md"
            mood={result.isCorrect ? 'celebrating' : 'detective'}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: result.isCorrect ? theme.colors.success.default : theme.colors.warning.default }}>
              <Award size={16} /> +{result.scoreEarned} Faktencheck-Punkte!
            </div>
            <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, margin: `${theme.spacing.xs} 0 0` }}>
              {result.leoExplanation}
            </p>
          </div>
        </div>

        {/* Urteil-Vergleich */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: theme.colors.neutral[50],
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginBottom: theme.spacing.xs }}>
              Deine Vermutung:
            </span>
            <VerdictPill verdict={result.userVerdict} size="sm" />
          </div>

          <div style={{ borderLeft: `1px solid ${theme.colors.border}` }} />

          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginBottom: theme.spacing.xs }}>
              Tatsächliche Wahrheit:
            </span>
            <VerdictPill verdict={result.isFake ? 'FAKE' : 'REAL'} size="sm" />
          </div>
        </div>

        {/* Enttarnte Warnsignale (falls Fake) */}
        {result.isFake && result.redFlags.length > 0 && (
          <div>
            <h4 style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.xs }}>
              Enttarnte Warnsignale (Red Flags):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              {result.redFlags.map((rf, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: theme.colors.warning.light,
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.sm,
                    border: `1px solid ${theme.colors.warning.default}`,
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.primary,
                  }}
                >
                  <strong>{rf.clue}:</strong> {rf.explanation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Echter Hintergrund falls vorhanden */}
        {result.realBackground && (
          <div style={{ backgroundColor: theme.colors.primary.light, padding: theme.spacing.sm, borderRadius: theme.borderRadius.sm, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.primary }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontWeight: theme.typography.fontWeight.bold, marginBottom: '2px' }}>
              <BookOpen size={14} color={theme.colors.primary.default} /> Was wirklich dahinter steckt:
            </div>
            {result.realBackground}
          </div>
        )}

        {/* Goldene Regel */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            border: `2px dashed ${theme.colors.primary.default}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.primary.default, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.xs, marginBottom: theme.spacing.xs }}>
            <Sparkles size={14} /> GOLDENE FAKTENCHECK-REGEL
          </div>
          <p style={{ margin: 0, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
            "{result.goldenRule}"
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing.sm }}>
          <Button variant="primary" size="md" onClick={onClose}>
            {result.isGameOver ? 'Zur Abschluss-Auswertung 🎉' : 'Nächste Nachricht prüfen ➡️'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
