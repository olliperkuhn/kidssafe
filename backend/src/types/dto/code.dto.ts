import { z } from 'zod';
import { CodeType, CodeStatus } from '@prisma/client';

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(4, 'Code ist zu kurz')
    .max(20, 'Code ist zu lang')
    .transform((val) => val.trim().toUpperCase()),
});

export type VerifyCodeRequestDTO = z.infer<typeof verifyCodeSchema>;

export const generateCodesSchema = z.object({
  classroomId: z.string().uuid('Ungültige Klassen-ID'),
  count: z.number().int().min(1, 'Mindestens 1 Code').max(40, 'Maximal 40 Codes pro Charge'),
  prefix: z.string().min(2).max(10).optional(),
  labelScheme: z.enum(['IPAD', 'ANIMALS', 'NUMBER']).default('IPAD'),
});

export type GenerateCodesRequestDTO = z.infer<typeof generateCodesSchema>;

export const createClassroomSchema = z.object({
  name: z.string().min(2, 'Klassenname muss mindestens 2 Zeichen lang sein').max(50),
});

export type CreateClassroomRequestDTO = z.infer<typeof createClassroomSchema>;

export interface ChildSessionDTO {
  sessionToken: string;
  code: string;
  label?: string;
  type: CodeType;
  classroomId?: string;
  avatarId?: string;
  expiresAt: string;
}

export interface InviteCodeDTO {
  id: string;
  code: string;
  label?: string;
  type: CodeType;
  status: CodeStatus;
  classroomId?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ClassroomDTO {
  id: string;
  name: string;
  teacherId: string;
  codeCount: number;
  createdAt: string;
}
