import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  username: z.string().min(3, 'Benutzername muss mindestens 3 Zeichen lang sein').max(50),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  role: z.enum(['PARENT', 'TEACHER']).default('PARENT'),
});

export type RegisterRequestDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

export type LoginRequestDTO = z.infer<typeof loginSchema>;

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponseDTO {
  user: UserDTO;
  token: string;
}
