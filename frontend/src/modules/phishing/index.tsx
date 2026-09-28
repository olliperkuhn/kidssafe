import { ModuleManifest } from '../types';
import { PhishingModulePage } from '../../components/pages/PhishingModulePage';
import { Fish } from 'lucide-react';

export const phishingPlugin: ModuleManifest = {
  slug: 'phishing-simulator',
  title: 'Phishing Simulator',
  description: 'Lerne gefälschte E-Mails, betrügerische Links und gefährliche Anhänge in realistischen Simulationen spielerisch zu enttarnen.',
  level: 'Klasse 4-6',
  version: '1.0.0',
  icon: <Fish size={24} />,
  enabled: true,
  component: PhishingModulePage,
};

export default phishingPlugin;
