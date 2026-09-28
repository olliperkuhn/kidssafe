import React, { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { theme } from '../../styles/theme';
import { ClassroomDTO, LabelScheme } from '../../types';

export interface CodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassroomDTO | null;
  onGenerate: (classroomId: string, count: number, prefix?: string, labelScheme?: LabelScheme) => Promise<void>;
  isLoading?: boolean;
}

export const CodeGeneratorModal: React.FC<CodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  classroom,
  onGenerate,
  isLoading = false,
}) => {
  const [count, setCount] = useState<number>(25);
  const [prefix, setPrefix] = useState<string>('SAFE');
  const [labelScheme, setLabelScheme] = useState<LabelScheme>('IPAD');

  if (!classroom) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(classroom.id, count, prefix.trim(), labelScheme);
    onClose();
  };

  const getExampleLabel = (): string => {
    switch (labelScheme) {
      case 'ANIMALS':
        return 'Fuchs, Eule, Biber, ...';
      case 'NUMBER':
        return '#01, #02, #03, ...';
      case 'IPAD':
      default:
        return 'iPad 01, iPad 02, ...';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Codes generieren: ${classroom.name}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
          Erstelle ein Kontingent an pseudonymisierten Einladungscodes für deine Schüler:innen.
        </p>

        <Input
          label="Anzahl der Codes (z. B. für iPad-Klassensatz)"
          type="number"
          min={1}
          max={40}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
          required
        />

        {/* Wählbares Pseudonym-Schema */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <label style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium }}>
            Geräte- / Pseudonym-Muster
          </label>
          <select
            value={labelScheme}
            onChange={(e) => setLabelScheme(e.target.value as LabelScheme)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.fontSize.md,
              fontFamily: theme.typography.fontFamily,
              borderRadius: theme.borderRadius.md,
              border: `1.5px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              outline: 'none',
            }}
          >
            <option value="IPAD">iPads (z. B. iPad 01, iPad 02)</option>
            <option value="ANIMALS">Tier-Namen (z. B. Fuchs, Eule, Biber)</option>
            <option value="NUMBER">Nummern (z. B. #01, #02)</option>
          </select>
          <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
            Vorschau: {getExampleLabel()}
          </span>
        </div>

        <Input
          label="Code-Präfix (z. B. Klassenbezeichnung)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value.toUpperCase())}
          maxLength={8}
          placeholder="SAFE"
        />

        <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, backgroundColor: theme.colors.neutral[50], padding: theme.spacing.sm, borderRadius: theme.borderRadius.sm }}>
          Beispiel-Code: <strong>{prefix || 'SAFE'}-7X2-9K</strong> (30 Tage gültig)
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
          <Button variant="outline" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Generiere...' : `${count} Codes erstellen`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
