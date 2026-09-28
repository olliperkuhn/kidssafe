import React, { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { AuthTabs } from '../molecules/AuthTabs';
import { theme } from '../../styles/theme';
import { LoginPayload, RegisterPayload } from '../../services/authApi';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (payload: LoginPayload) => Promise<void>;
  onRegister: (payload: RegisterPayload) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  isLoading = false,
  error,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'TEACHER' | 'PARENT'>('TEACHER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      await onLogin({ email, password });
    } else {
      await onRegister({ email, password, username, role });
    }
  };

  const selectContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: '100%',
  };

  const selectStyles: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily,
    borderRadius: theme.borderRadius.md,
    border: `1.5px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    outline: 'none',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Erwachsenen-Portal">
      <AuthTabs activeTab={tab} onChange={setTab} />

      {error && (
        <div style={{ backgroundColor: theme.colors.danger.light, color: theme.colors.danger.default, padding: theme.spacing.sm, borderRadius: theme.borderRadius.md, fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing.md }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {tab === 'register' && (
          <>
            <Input
              label="Dein Name / Anzeigename"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Z. B. Frau Müller oder Herr Schmidt"
              required
            />
            <div style={selectContainerStyles}>
              <label style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                Deine Rolle
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'TEACHER' | 'PARENT')}
                style={selectStyles}
              >
                <option value="TEACHER">Lehrkraft (Schulklassen & Codes verwalten)</option>
                <option value="PARENT">Elternteil (Private Begleitung zuhause)</option>
              </select>
            </div>
          </>
        )}

        <Input
          label="E-Mail-Adresse"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@schule.de oder name@mail.de"
          required
        />

        <Input
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mindestens 8 Zeichen"
          required
        />

        <Button type="submit" fullWidth disabled={isLoading} style={{ marginTop: theme.spacing.sm }}>
          {isLoading ? 'Bitte warten...' : tab === 'login' ? 'Jetzt Anmelden' : 'Konto anlegen'}
        </Button>
      </form>
    </Modal>
  );
};
