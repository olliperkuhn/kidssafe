import { z } from 'zod';

export const heartbeatSchema = z.object({
  activeModule: z.string().min(1).max(50).optional(),
  completedScenarios: z.number().int().min(0).max(100).optional(),
  totalScenarios: z.number().int().min(0).max(100).optional(),
});

export type HeartbeatRequestDTO = z.infer<typeof heartbeatSchema>;

export type StudentActivityStatus = 'ONLINE' | 'OFFLINE' | 'COMPLETED';

export interface StudentTrackingItemDTO {
  codeId: string;
  code: string;
  label: string;
  status: StudentActivityStatus;
  lastActiveSecondsAgo: number;
  activeModule?: string;
  completedScenarios: number;
  totalScenarios: number;
  progressPercent: number;
}

export interface ClassroomTrackingResponseDTO {
  classroomId: string;
  classroomName: string;
  totalCodes: number;
  activeCodes: number;
  completedCodes: number;
  students: StudentTrackingItemDTO[];
}
