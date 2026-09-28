export interface HealthStatusDTO {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  service: string;
  database: {
    connected: boolean;
    message?: string;
  };
}

export type UserRole = 'PARENT' | 'TEACHER' | 'ADMIN';

export type CodeType = 'STUDENT_CLASS' | 'CHILD_FAMILY' | 'GUEST';
export type CodeStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

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

export interface ChildSessionDTO {
  sessionToken: string;
  code: string;
  type: CodeType;
  classroomId?: string;
  avatarId?: string;
  expiresAt: string;
}

export interface InviteCodeDTO {
  id: string;
  code: string;
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

export type ViewState = 'HOME' | 'STUDENT_DASHBOARD' | 'TEACHER_DASHBOARD' | 'PARENT_DASHBOARD';
