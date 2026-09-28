import { BackendModulePlugin } from '../module.interface';
import fakeNewsRoutes from './fakeNews.routes';

const fakeNewsPlugin: BackendModulePlugin = {
  slug: 'fake-news-detector',
  title: 'Fake News Detektor',
  description: 'Untersuche Schlagzeilen und Nachrichten auf ihren Wahrheitsgehalt mit Löwe Leo.',
  version: '1.0.0',
  defaultActive: true,
  router: fakeNewsRoutes,
};

export default fakeNewsPlugin;
