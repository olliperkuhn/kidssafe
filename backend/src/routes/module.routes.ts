import { Router, Request, Response, NextFunction } from 'express';
import { moduleRegistry } from '../modules/moduleRegistry';
import { authenticateAdult, requireRole } from '../middleware/auth.middleware';
import { env } from '../config/env';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * Middleware: Schützt Modul-Toggles in Produktion strikt, erlaubt im Dev-Modus lokale Tests.
 */
function protectModuleToggle(req: Request, res: Response, next: NextFunction): void {
  const isProduction = env.NODE_ENV === 'production';
  const hasAuth = Boolean(req.headers.authorization);

  if (isProduction || hasAuth) {
    authenticateAdult(req, res, (err) => {
      if (err) return next(err);
      requireRole(UserRole.TEACHER, UserRole.ADMIN)(req, res, next);
    });
  } else {
    // Im lokalen Entwicklungsmodus ohne Auth-Header für lokale Testskripte gestatten
    next();
  }
}

/**
 * GET /api/modules - Liefert alle aktuell aktiven Lernmodule für das Frontend.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const modules = await moduleRegistry.getActiveModulesPublicInfo();
    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/modules/:moduleSlug/toggle - Erlaubt das Zu- oder Abschalten eines Moduls.
 * In Produktion geschützt: Nur für Lehrkräfte und Administratoren.
 */
router.post('/:moduleSlug/toggle', protectModuleToggle, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawSlug = req.params.moduleSlug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    if (!slug) {
      res.status(400).json({ error: { message: 'Modul-Slug fehlt' } });
      return;
    }

    const { isActive } = req.body as { isActive?: boolean };
    if (typeof isActive !== 'boolean') {
      res.status(400).json({ error: { message: 'isActive (boolean) ist erforderlich' } });
      return;
    }

    await moduleRegistry.setModuleActive(slug, isActive);
    res.status(200).json({ slug, isActive, message: `Modul "${slug}" wurde ${isActive ? 'aktiviert' : 'deaktiviert'}.` });
  } catch (err) {
    next(err);
  }
});

/**
 * Dynamischer Dispatcher & Feature-Toggle-Middleware:
 * Fängt alle Anfragen an /api/modules/:moduleSlug/* ab.
 * Ist das Modul abgeschaltet, wird der Zugriff sofort mit 503 abgefangen,
 * ohne dass das Modul ausgeführt wird.
 */
router.use('/:moduleSlug', async (req: Request, res: Response, next: NextFunction) => {
  const rawSlug = req.params.moduleSlug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  if (!slug) {
    next();
    return;
  }

  const plugin = moduleRegistry.getPlugin(slug);
  if (!plugin) {
    res.status(404).json({ error: { message: `Lernmodul "${slug}" nicht gefunden.` } });
    return;
  }

  const isActive = await moduleRegistry.isModuleActive(slug);
  if (!isActive) {
    res.status(503).json({
      error: {
        code: 'MODULE_DISABLED',
        message: `Das Lernmodul "${plugin.title}" ist derzeit deaktiviert.`,
      },
    });
    return;
  }

  // Leite Anfrage an den Router des Plugins weiter
  plugin.router(req, res, next);
});

export default router;
