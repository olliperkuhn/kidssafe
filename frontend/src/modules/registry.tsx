import { ModuleManifest } from './types';
import phishingPlugin from './phishing/index';
import { Newspaper, KeyRound } from 'lucide-react';

export class FrontendModuleRegistry {
  private modules = new Map<string, ModuleManifest>();

  constructor() {
    // 1. Phishing Simulator (aktiv)
    this.registerModule(phishingPlugin);

    // 2. Fake News Detektor (in Vorbereitung für 5.3)
    this.registerModule({
      slug: 'fake-news-detector',
      title: 'Fake News Detektor',
      description: 'Untersuche Schlagzeilen, Social-Media-Nachrichten und manipulierte Bilder auf ihren Wahrheitsgehalt.',
      level: 'Klasse 4-6',
      version: '0.9.0',
      icon: <Newspaper size={24} />,
      enabled: false,
      component: () => null,
    });

    // 3. Passwort & Datenschutz (in Vorbereitung)
    this.registerModule({
      slug: 'password-security',
      title: 'Passwort & Datenschutz',
      description: 'Erfahre, wie sichere Passwörter aufgebaut sind und wie du deine privaten Daten vor neugierigen Blicken schützt.',
      level: 'Klasse 4-6',
      version: '0.5.0',
      icon: <KeyRound size={24} />,
      enabled: false,
      component: () => null,
    });
  }

  /**
   * Registriert ein neues Modul-Plugin im Frontend.
   */
  public registerModule(manifest: ModuleManifest): void {
    this.modules.set(manifest.slug, manifest);
  }

  /**
   * Liefert alle registrierten Module.
   */
  public getAllModules(): ModuleManifest[] {
    return Array.from(this.modules.values());
  }

  /**
   * Liefert nur aktivierte Module.
   */
  public getAvailableModules(): ModuleManifest[] {
    return this.getAllModules().filter((m) => m.enabled);
  }

  /**
   * Sucht ein Modul anhand seines Slugs.
   */
  public getModule(slug: string): ModuleManifest | undefined {
    return this.modules.get(slug);
  }

  /**
   * Erlaubt das dynamische Aktivieren oder Deaktivieren eines Moduls im Client (Feature Toggle).
   */
  public setModuleEnabled(slug: string, enabled: boolean): void {
    const mod = this.modules.get(slug);
    if (mod) {
      mod.enabled = enabled;
    }
  }
}

export const moduleRegistry = new FrontendModuleRegistry();
