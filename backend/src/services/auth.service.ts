import { prisma } from '../models/prisma';
import { passwordService } from './password.service';
import { tokenService } from './token.service';
import { RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO, UserDTO } from '../types/dto/auth.dto';
import { AppError } from '../middleware/errorHandler';
import { UserRole } from '@prisma/client';

export class AuthService {
  public async register(dto: RegisterRequestDTO): Promise<AuthResponseDTO> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      const error: AppError = new Error('Diese E-Mail-Adresse ist bereits registriert');
      error.statusCode = 409;
      throw error;
    }

    const { hash, salt } = await passwordService.hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username,
        passwordHash: hash,
        salt,
        role: dto.role as UserRole,
      },
    });

    const token = tokenService.signAdultToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.toUserDTO(user),
      token,
    };
  }

  public async login(dto: LoginRequestDTO): Promise<AuthResponseDTO> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      const error: AppError = new Error('Ungültige Anmeldedaten');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await passwordService.verifyPassword(dto.password, user.passwordHash, user.salt);
    if (!isValid) {
      const error: AppError = new Error('Ungültige Anmeldedaten');
      error.statusCode = 401;
      throw error;
    }

    const token = tokenService.signAdultToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.toUserDTO(user),
      token,
    };
  }

  public async getUserById(userId: string): Promise<UserDTO> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: AppError = new Error('Benutzer nicht gefunden');
      error.statusCode = 404;
      throw error;
    }

    return this.toUserDTO(user);
  }

  private toUserDTO(user: { id: string; email: string; username: string; role: UserRole; createdAt: Date }): UserDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
