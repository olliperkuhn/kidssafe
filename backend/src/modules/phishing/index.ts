import { BackendModulePlugin } from '../module.interface';
import phishingRouter from './phishing.routes';

export const phishingPlugin: BackendModulePlugin = {
  slug: 'phishing-simulator',
  title: 'Phishing Simulator',
  description: 'Interaktiver Chat mit Angreifer und Detektiv Löwe Leo zur Erkennung von Phishing-Fallen.',
  version: '1.0.0',
  defaultActive: true,
  router: phishingRouter,
};

export default phishingPlugin;
