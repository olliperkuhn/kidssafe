import React, { useState, useEffect, useCallback } from 'react';
import { BaseLayout } from '../templates/BaseLayout';
import { ClassroomCard } from '../molecules/ClassroomCard';
import { CodePrintView } from '../molecules/CodePrintView';
import { CodeGeneratorModal } from '../organisms/CodeGeneratorModal';
import { Modal } from '../atoms/Modal';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { theme } from '../../styles/theme';
import { ClassroomDTO, InviteCodeDTO, UserDTO } from '../../types';
import { listTeacherClassrooms, createClassroom, generateClassroomCodes } from '../../services/codeApi';
import { Plus, School, AlertCircle } from 'lucide-react';

export interface TeacherDashboardPageProps {
  user: UserDTO;
  token: string;
  onLogout: () => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
  user,
  token,
  onLogout,
}) => {
  const [classrooms, setClassrooms] = useState<ClassroomDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Sub-views
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [generatorClass, setGeneratorClass] = useState<ClassroomDTO | null>(null);
  const [printClass, setPrintClass] = useState<ClassroomDTO | null>(null);
  const [currentCodes, setCurrentCodes] = useState<InviteCodeDTO[]>([]);

  const loadClassrooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await listTeacherClassrooms(token);
      setClassrooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Klassen konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadClassrooms();
  }, [loadClassrooms]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      await createClassroom(token, newClassName.trim());
      setNewClassName('');
      setIsNewClassModalOpen(false);
      loadClassrooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Klasse konnte nicht angelegt werden');
    }
  };

  const handleGenerateCodes = async (classroomId: string, count: number, prefix?: string) => {
    try {
      const generated = await generateClassroomCodes(token, classroomId, count, prefix);
      const targetClass = classrooms.find((c) => c.id === classroomId) || null;
      setCurrentCodes(generated);
      setPrintClass(targetClass);
      loadClassrooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Codes konnten nicht generiert werden');
    }
  };

  if (printClass) {
    return (
      <BaseLayout adultUser={user} onLogoutAdult={onLogout}>
        <CodePrintView
          classroom={printClass}
          codes={currentCodes}
          onBack={() => setPrintClass(null)}
        />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout adultUser={user} onLogoutAdult={onLogout}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl, flexWrap: 'wrap', gap: theme.spacing.md }}>
        <div>
          <h1 style={{ fontSize: theme.typography.fontSize.xxl, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
            Lehrkräfte-Dashboard
          </h1>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
            Verwalte deine Klassen und generiere pseudonymisierte Einladungscodes für deine Schüler:innen.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsNewClassModalOpen(true)}>
          <Plus size={18} style={{ marginRight: theme.spacing.xs }} />
          Neue Klasse anlegen
        </Button>
      </div>

      {error && (
        <div style={{ backgroundColor: theme.colors.danger.light, color: theme.colors.danger.default, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.lg, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl, color: theme.colors.text.muted }}>
          Lade Klassen...
        </div>
      ) : classrooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}` }}>
          <School size={48} color={theme.colors.text.muted} style={{ marginBottom: theme.spacing.md }} />
          <h3 style={{ fontSize: theme.typography.fontSize.lg, color: theme.colors.text.primary }}>Noch keine Klassen angelegt</h3>
          <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, margin: `${theme.spacing.xs} 0 ${theme.spacing.lg}` }}>
            Lege deine erste Schulklasse an, um Code-Kontingente für den Unterricht zu erzeugen.
          </p>
          <Button variant="primary" onClick={() => setIsNewClassModalOpen(true)}>
            Erste Klasse anlegen
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: theme.spacing.lg }}>
          {classrooms.map((c) => (
            <ClassroomCard
              key={c.id}
              classroom={c}
              onGenerateCodes={(target) => setGeneratorClass(target)}
              onPrintCodes={(target) => {
                setPrintClass(target);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal: Neue Klasse */}
      <Modal isOpen={isNewClassModalOpen} onClose={() => setIsNewClassModalOpen(false)} title="Neue Klasse anlegen">
        <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <Input
            label="Klassenname (z. B. Klasse 4a, AG Medien)"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Klasse 4a"
            required
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
            <Button variant="outline" type="button" onClick={() => setIsNewClassModalOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" type="submit">
              Klasse speichern
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Code Generator */}
      <CodeGeneratorModal
        isOpen={Boolean(generatorClass)}
        onClose={() => setGeneratorClass(null)}
        classroom={generatorClass}
        onGenerate={handleGenerateCodes}
      />
    </BaseLayout>
  );
};
