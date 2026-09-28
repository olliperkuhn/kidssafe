import { ModuleManifest } from '../types';
import { FakeNewsModulePage } from './components/pages/FakeNewsModulePage';
import { Newspaper } from 'lucide-react';

export const fakeNewsPlugin: ModuleManifest = {
  slug: 'fake-news-detector',
  title: 'Fake News Detektor',
  description: 'Untersuche Schlagzeilen, Social-Media-Nachrichten und Tier-Meldungen auf ihren Wahrheitsgehalt mit Löwe Leo.',
  level: 'Klasse 4-8',
  version: '1.0.0',
  icon: <Newspaper size={24} />,
  enabled: true,
  component: FakeNewsModulePage,
};

export default fakeNewsPlugin;
