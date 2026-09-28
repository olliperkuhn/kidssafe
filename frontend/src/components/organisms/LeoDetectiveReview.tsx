import React from 'react';
import { theme } from '../../styles/theme';
import { PhishingReviewDTO } from '../../types';
import { LeoAvatar } from '../atoms/LeoAvatar';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Search, Lightbulb, ArrowRight, Award, CheckCircle } from 'lucide-react';

export interface LeoDetectiveReviewProps {
  review: PhishingReviewDTO;
  hasNextScenario: boolean;
  onProceed: () => void;
}

export const LeoDetectiveReview: React.FC<LeoDetectiveReviewProps> = ({
  review,
  hasNextScenario,
  onProceed,
}) => {
  const isDefended = review.outcome === 'DEFENDED';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
      {/* Leo Begrüßungskarte */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexWrap: 'wrap' }}>
          <LeoAvatar mood={isDefended ? 'friendly' : 'detective'} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: theme.spacing.xs }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: isDefended ? theme.colors.success.default : theme.colors.warning.default, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.xs }}>
                <Search size={16} />
                <span>{isDefended ? 'FALL ABGEWEHRT: DETEKTIV-ANALYSE MIT LÖWE LEO' : 'DETEKTIV-ANALYSE MIT LÖWE LEO'}</span>
              </div>
              {review.providerUsed && review.providerUsed !== 'mock' ? (
                <Badge variant="success">✨ Live-KI ({review.providerUsed})</Badge>
              ) : (
                <Badge variant="neutral">📚 Offline-Bibliothek</Badge>
              )}
            </div>
            <h2 style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: '2px 0' }}>
              {review.scenarioTitle}
            </h2>
            <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              {review.leoSummary}
            </p>
          </div>
        </div>
      </Card>

      {/* Warnsignale im Detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        <h3 style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
          <Lightbulb size={18} color={theme.colors.warning.default} />
          <span>Die enttarnten Warnsignale in diesem Chat:</span>
        </h3>

        {review.signals.map((signal, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: theme.colors.surface,
              border: `1.5px solid ${theme.colors.border}`,
              borderLeft: `5px solid ${theme.colors.warning.default}`,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              boxShadow: theme.shadows.sm,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: theme.spacing.xs, marginBottom: theme.spacing.xs }}>
              <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold, color: '#B45309', backgroundColor: theme.colors.warning.light, padding: '2px 8px', borderRadius: theme.borderRadius.full }}>
                Falle {idx + 1}: {signal.type}
              </span>
              <span style={{ fontSize: theme.typography.fontSize.xs, fontStyle: 'italic', color: theme.colors.text.muted, backgroundColor: theme.colors.neutral[100], padding: '2px 8px', borderRadius: theme.borderRadius.sm }}>
                "{signal.quote}"
              </span>
            </div>

            <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.primary, margin: `${theme.spacing.xs} 0` }}>
              {signal.explanation}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.primary.hover, marginTop: theme.spacing.xs }}>
              <CheckCircle size={14} color={theme.colors.primary.default} />
              <span>Agenten-Tipp: {signal.protectionTip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Goldene Regel */}
      <div
        style={{
          backgroundColor: theme.colors.primary.light,
          border: `2px solid ${theme.colors.primary.default}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary.hover, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ⭐ Goldene Schutz-Regel zum Merken ⭐
        </div>
        <div style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary.default, marginTop: theme.spacing.xs }}>
          {review.goldenRule}
        </div>
      </div>

      {/* Weiter-Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing.sm }}>
        <Button variant="primary" size="lg" onClick={onProceed}>
          {hasNextScenario ? (
            <>
              Nächsten Fall knacken
              <ArrowRight size={18} style={{ marginLeft: theme.spacing.xs }} />
            </>
          ) : (
            <>
              <Award size={18} style={{ marginRight: theme.spacing.xs }} />
              Zur Cyber-Detektiv-Urkunde!
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
