import { ChildSessionDTO, ClassroomDTO, InviteCodeDTO, LabelScheme } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Verifiziert einen Einladungscode und setzt das Session-Cookie im Browser.
 */
export async function verifyChildCode(code: string): Promise<ChildSessionDTO> {
  const response = await fetch(`${API_BASE_URL}/codes/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Ungültiger Einladungscode');
  }

  return data as ChildSessionDTO;
}

/**
 * Prüft beim Laden der App, ob bereits eine aktive Sitzung im Cookie vorliegt.
 */
export async function resumeChildSession(): Promise<ChildSessionDTO | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/codes/resume`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as ChildSessionDTO;
  } catch {
    return null;
  }
}

/**
 * Erstellt einen 8-Stunden Gastzugang für ein Kind.
 */
export async function createGuestSession(): Promise<ChildSessionDTO> {
  const response = await fetch(`${API_BASE_URL}/codes/guest`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gastzugang konnte nicht erstellt werden');
  }

  return data as ChildSessionDTO;
}

/**
 * Legt eine neue Klasse für eine Lehrkraft an.
 */
export async function createClassroom(token: string, name: string): Promise<ClassroomDTO> {
  const response = await fetch(`${API_BASE_URL}/codes/classrooms`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Klasse konnte nicht erstellt werden');
  }

  return data as ClassroomDTO;
}

/**
 * Ruft die Klassen einer Lehrkraft ab.
 */
export async function listTeacherClassrooms(token: string): Promise<ClassroomDTO[]> {
  const response = await fetch(`${API_BASE_URL}/codes/classrooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Klassen konnten nicht geladen werden');
  }

  return data as ClassroomDTO[];
}

/**
 * Generiert neue Codes für eine Klasse mit optionalem Pseudonym-Label-Schema.
 */
export async function generateClassroomCodes(
  token: string,
  classroomId: string,
  count: number,
  prefix?: string,
  labelScheme?: LabelScheme
): Promise<InviteCodeDTO[]> {
  const response = await fetch(`${API_BASE_URL}/codes/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ classroomId, count, prefix, labelScheme }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Codes konnten nicht generiert werden');
  }

  return data as InviteCodeDTO[];
}
