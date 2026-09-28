import React from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { Card } from '../atoms/Card';
import { theme } from '../../styles/theme';
import { UserDTO } from '../../types';
import { ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';

export interface ParentDashboardPageProps {
  user: UserDTO;
  onLogout: () => void;
}

export const ParentDashboardPage: React.FC<ParentDashboardPageProps> = ({ user, onLogout }) => {
  return (
    <BaseLayout adultUser={user} onLogoutAdult={onLogout}>
      <div style={{ marginBottom: theme.spacing.xl }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xxl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
          Eltern-Portal
        </h1>
        <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
          Begleite dein Kind sicher in die digitale Welt – ohne Datenerhebung und ohne Klarnamenspeicherung.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
            <ShieldCheck size={24} color={theme.colors.primary.default} />
            <h3 style={{ fontSize: theme.typography.fontSize.lg, color: theme.colors.text.primary }}>
              Datenschutz & Privatsphäre
            </h3>
          </div>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, lineHeight: theme.typography.lineHeight.normal }}>
            Kidssafe speichert serverseitig keine Namen oder persönlichen Daten deines Kindes. Der Lernfortschritt ist ausschließlich an pseudonyme Codes gebunden.
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
            <HeartHandshake size={24} color={theme.colors.secondary.default} />
            <h3 style={{ fontSize: theme.typography.fontSize.lg, color: theme.colors.text.primary }}>
              Gemeinsam Lernen
            </h3>
          </div>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, lineHeight: theme.typography.lineHeight.normal }}>
            In den Modulen lernt dein Kind das Erkennen von Phishing-Mails, Fake News und den sicheren Umgang mit Passwörtern.
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
            <BookOpen size={24} color={theme.colors.success.default} />
            <h3 style={{ fontSize: theme.typography.fontSize.lg, color: theme.colors.text.primary }}>
              Tipps für den Familienalltag
            </h3>
          </div>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, lineHeight: theme.typography.lineHeight.normal }}>
            Sprecht in der Familie offen über verdächtige Nachrichten und vereinbart Regeln für die Nutzung digitaler Medien.
          </p>
        </Card>
      </div>
    </BaseLayout>
  );
};
