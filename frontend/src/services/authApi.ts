import { AuthResponseDTO, UserDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  role: 'PARENT' | 'TEACHER';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerAdult(payload: RegisterPayload): Promise<AuthResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Registrierung fehlgeschlagen');
  }

  return data as AuthResponseDTO;
}

export async function loginAdult(payload: LoginPayload): Promise<AuthResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Anmeldung fehlgeschlagen');
  }

  return data as AuthResponseDTO;
}

export async function fetchCurrentUser(token: string): Promise<UserDTO> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Profil konnte nicht geladen werden');
  }

  return data as UserDTO;
}
