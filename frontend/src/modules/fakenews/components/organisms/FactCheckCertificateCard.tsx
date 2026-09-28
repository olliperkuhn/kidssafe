import React from 'react';
import { theme } from '../../../../styles/theme';
import { Button } from '../../../../components/atoms/Button';
import { LeoAvatar } from '../../../../components/atoms/LeoAvatar';
import { FakeNewsSummaryDTO } from '../../types';
import { Award, Printer, RotateCcw, CheckCircle } from 'lucide-react';

export interface FactCheckCertificateCardProps {
  summary: FakeNewsSummaryDTO;
  studentCode: string;
  onRestart: () => void;
}

export const FactCheckCertificateCard: React.FC<FactCheckCertificateCardProps> = ({
  summary,
  studentCode,
  onRestart,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        border: `3px double ${theme.colors.primary.default}`,
        boxShadow: theme.shadows.lg,
        padding: theme.spacing.xxl,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: theme.spacing.md }}>
        <LeoAvatar size="lg" mood="celebrating" />
      </div>

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          backgroundColor: theme.colors.primary.light,
          color: theme.colors.primary.default,
          padding: '4px 12px',
          borderRadius: theme.borderRadius.full,
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: theme.spacing.md,
        }}
      >
        <Award size={14} /> Offizielles Kidssafe Zertifikat
      </span>

      <h1
        style={{
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          margin: `0 0 ${theme.spacing.sm} 0`,
        }}
      >
        Fakten-Detektiv Diplom 🎓
      </h1>

      <p style={{ fontSize: theme.typography.fontSize.md, color: theme.colors.text.secondary, margin: `0 0 ${theme.spacing.lg} 0` }}>
        Hiermit wird bescheinigt, dass Detektiv <strong>{studentCode}</strong> die Kidssafe-Faktenredaktion erfolgreich absolviert hat.
      </p>

      {/* Ergebnis-Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: theme.spacing.md,
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.xl,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, display: 'block' }}>Ergebnis</span>
          <span style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary.default }}>
            {summary.correctCount} / {summary.totalArticles}
          </span>
        </div>

        <div>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, display: 'block' }}>Trefferquote</span>
          <span style={{ fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.success.default }}>
            {summary.scorePercent}%
          </span>
        </div>

        <div>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, display: 'block' }}>Titel</span>
          <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            {summary.title}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginBottom: theme.spacing.xl }}>
        <CheckCircle size={14} color={theme.colors.success.default} />
        Ausgestellt am {summary.completedAt} • Stufe: {summary.difficulty === 'JUNIOR' ? 'Junior (Klasse 4-5)' : 'Senior (ab Klasse 6)'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md, flexWrap: 'wrap' }}>
        <Button variant="outline" size="md" onClick={handlePrint}>
          <Printer size={16} style={{ marginRight: theme.spacing.xs }} />
          Diplom drucken
        </Button>
        <Button variant="primary" size="md" onClick={onRestart}>
          <RotateCcw size={16} style={{ marginRight: theme.spacing.xs }} />
          Neue Runde starten
        </Button>
      </div>
    </div>
  );
};
