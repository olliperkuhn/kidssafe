import React from 'react';
import { theme } from '../../styles/theme';
import { LeoAvatar } from '../atoms/LeoAvatar';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Award, ArrowLeft, Printer, Shield, Sparkles } from 'lucide-react';

export interface PhishingCertificateCardProps {
  studentLabel?: string;
  scenarioCount: number;
  onFinish: () => void;
}

export const PhishingCertificateCard: React.FC<PhishingCertificateCardProps> = ({
  studentLabel = 'Cyber-Agent',
  scenarioCount,
  onFinish,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
      <Card padding="lg" style={{ textAlign: 'center', border: `3px solid #F59E0B`, boxShadow: theme.shadows.md, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: theme.spacing.md }}>
          <LeoAvatar mood="celebrating" size="xl" />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: theme.spacing.xs, backgroundColor: theme.colors.warning.light, color: '#B45309', padding: `4px ${theme.spacing.md}`, borderRadius: theme.borderRadius.full, fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold, marginBottom: theme.spacing.sm }}>
          <Sparkles size={16} />
          <span>OFFIZIELLES DETEKTIV-DIPLOM</span>
        </div>

        <h1 style={{ fontSize: theme.typography.fontSize.xxl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.xs }}>
          Herzlichen Glückwunsch!
        </h1>

        <p style={{ fontSize: theme.typography.fontSize.md, color: theme.colors.text.secondary, maxWidth: '500px', margin: '0 auto' }}>
          Du hast alle <strong style={{ color: theme.colors.primary.default }}>{scenarioCount} Fälle</strong> im Phishing-Simulator erfolgreich gemeistert und die Tricks der Online-Betrüger durchschaut.
        </p>

        {/* Auszeichnungs-Plakette */}
        <div
          style={{
            margin: `${theme.spacing.lg} auto`,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.primary.light,
            borderRadius: theme.borderRadius.lg,
            border: `2px dashed ${theme.colors.primary.default}`,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '280px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.primary.default, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.lg }}>
            <Award size={24} />
            <span>Geprüfter Phishing-Detektiv</span>
          </div>
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginTop: '2px' }}>
            Ausgezeichnetes Gerät / Pseudonym: <strong>{studentLabel}</strong>
          </div>
        </div>

        {/* Die 3 goldenen Regeln */}
        <div style={{ textAlign: 'left', backgroundColor: theme.colors.neutral[50], padding: theme.spacing.md, borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, marginTop: theme.spacing.md }}>
          <h3 style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, marginBottom: theme.spacing.xs, display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <Shield size={16} color={theme.colors.primary.default} />
            <span>Deine 3 goldenen Phishing-Regeln für den Alltag:</span>
          </h3>
          <ul style={{ margin: 0, paddingLeft: theme.spacing.lg, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, lineHeight: '1.6' }}>
            <li><strong>1. Niemals Passwörter oder SMS-Codes weitergeben:</strong> Weder Admins noch Spieleentwickler fragen danach!</li>
            <li><strong>2. Bei Zeitdruck & Gratis-Geld sofort stoppen:</strong> Echte Geschenke gibt es im Internet fast nie.</li>
            <li><strong>3. Immer Erwachsene fragen:</strong> Wenn ein Link komisch aussieht, zeige ihn Eltern oder Lehrkräften.</li>
          </ul>
        </div>

        {/* Aktions-Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md, marginTop: theme.spacing.lg, flexWrap: 'wrap' }}>
          <Button variant="outline" size="md" onClick={handlePrint}>
            <Printer size={18} style={{ marginRight: theme.spacing.xs }} />
            Urkunde drucken
          </Button>

          <Button variant="primary" size="md" onClick={onFinish}>
            <ArrowLeft size={18} style={{ marginRight: theme.spacing.xs }} />
            Zurück zur Missions-Zentrale
          </Button>
        </div>
      </Card>
    </div>
  );
};
