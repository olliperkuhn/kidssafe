import { prisma } from '../models/prisma';
import { BackendModulePlugin, ModulePublicInfoDTO } from './module.interface';
import phishingPlugin from './phishing/index';
import fakeNewsPlugin from './fakenews/index';

export class ModuleRegistry {
  private plugins = new Map<string, BackendModulePlugin>();
  private activeOverrides = new Map<string, boolean>();

  constructor() {
    // Standard-Module initial registrieren
    this.registerModule(phishingPlugin);
    this.registerModule(fakeNewsPlugin);
  }

  /**
   * Registriert ein neues Backend-Lernmodul-Plugin.
   */
  public registerModule(plugin: BackendModulePlugin): void {
    this.plugins.set(plugin.slug, plugin);
    // Auch Kurzform-Alias unterstützen (z. B. 'phishing' -> 'phishing-simulator')
    if (plugin.slug.includes('-')) {
      const shortAlias = plugin.slug.split('-')[0];
      if (shortAlias && !this.plugins.has(shortAlias)) {
        this.plugins.set(shortAlias, plugin);
      }
    }
  }

  /**
   * Liefert alle registrierten Plugins.
   */
  public getAllPlugins(): BackendModulePlugin[] {
    // Duplikate durch Aliase herausfiltern
    const unique = new Map<string, BackendModulePlugin>();
    for (const p of this.plugins.values()) {
      unique.set(p.slug, p);
    }
    return Array.from(unique.values());
  }

  /**
   * Sucht ein Plugin anhand seines Slugs oder Alias.
   */
  public getPlugin(slug: string): BackendModulePlugin | undefined {
    return this.plugins.get(slug);
  }

  /**
   * Prüft, ob ein Modul aktiv ist (kombiniert DB-Status und Runtime-Overrides).
   */
  public async isModuleActive(slug: string): Promise<boolean> {
    const plugin = this.getPlugin(slug);
    if (!plugin) {
      return false;
    }

    // 1. Lokaler Runtime-Override prüfen
    if (this.activeOverrides.has(plugin.slug)) {
      return Boolean(this.activeOverrides.get(plugin.slug));
    }

    // 2. Datenbank-Eintrag prüfen
    try {
      const dbEntry = await prisma.learningModule.findUnique({
        where: { slug: plugin.slug },
      });

      if (!dbEntry) {
        // Falls noch nicht in DB hinterlegt, anlegen
        await prisma.learningModule.create({
          data: {
            slug: plugin.slug,
            title: plugin.title,
            description: plugin.description,
            version: plugin.version,
            isActive: plugin.defaultActive,
          },
        });
        return plugin.defaultActive;
      }

      return dbEntry.isActive;
    } catch {
      // Fallback bei DB-Fehlern
      return plugin.defaultActive;
    }
  }

  /**
   * Aktiviert oder deaktiviert ein Modul zur Laufzeit und in der DB (Feature Toggle).
   */
  public async setModuleActive(slug: string, isActive: boolean): Promise<void> {
    const plugin = this.getPlugin(slug);
    if (!plugin) {
      throw new Error(`Modul "${slug}" nicht gefunden`);
    }

    this.activeOverrides.set(plugin.slug, isActive);

    try {
      await prisma.learningModule.upsert({
        where: { slug: plugin.slug },
        update: { isActive },
        create: {
          slug: plugin.slug,
          title: plugin.title,
          description: plugin.description,
          version: plugin.version,
          isActive,
        },
      });
    } catch {
      // DB-Aktualisierung fehlgeschlagen, lokaler Override bleibt wirksam
    }
  }

  /**
   * Liefert die Liste aller öffentlich sichtbaren, aktiven Module für das Frontend.
   */
  public async getActiveModulesPublicInfo(): Promise<ModulePublicInfoDTO[]> {
    const uniquePlugins = this.getAllPlugins();
    const result: ModulePublicInfoDTO[] = [];

    for (const plugin of uniquePlugins) {
      const active = await this.isModuleActive(plugin.slug);
      if (active) {
        result.push({
          slug: plugin.slug,
          title: plugin.title,
          description: plugin.description,
          version: plugin.version,
          isActive: true,
        });
      }
    }

    return result;
  }
}

export const moduleRegistry = new ModuleRegistry();
