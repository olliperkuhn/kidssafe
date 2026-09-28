import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, AuthResponseDTO, UserDTO } from '../types/dto/auth.dto';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  public async register(req: Request, res: Response<AuthResponseDTO>, next: NextFunction): Promise<void> {
    try {
      const parseResult = registerSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error: AppError = new Error(parseResult.error.errors[0]?.message ?? 'Ungültige Registrierungsdaten');
        error.statusCode = 400;
        error.details = parseResult.error.format();
        return next(error);
      }

      const result = await authService.register(parseResult.data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response<AuthResponseDTO>, next: NextFunction): Promise<void> {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        const error: AppError = new Error(parseResult.error.errors[0]?.message ?? 'Ungültige Anmeldedaten');
        error.statusCode = 400;
        error.details = parseResult.error.format();
        return next(error);
      }

      const result = await authService.login(parseResult.data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getMe(req: Request, res: Response<UserDTO>, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const error: AppError = new Error('Nicht authentifiziert');
        error.statusCode = 401;
        return next(error);
      }

      const user = await authService.getUserById(req.user.userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
