import { Router } from 'express';

export interface BackendModulePlugin {
  slug: string;
  title: string;
  description: string;
  version: string;
  defaultActive: boolean;
  router: Router;
}

export interface ModulePublicInfoDTO {
  slug: string;
  title: string;
  description: string;
  version: string;
  isActive: boolean;
}
