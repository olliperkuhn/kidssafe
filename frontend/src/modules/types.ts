import React from 'react';
import { ChildSessionDTO } from '../types';

export interface ModuleProps {
  session: ChildSessionDTO;
  onBack: () => void;
  onLeaveSession: () => void;
}

export interface ModuleManifest {
  slug: string;
  title: string;
  description: string;
  level: string;
  version: string;
  icon: React.ReactNode;
  enabled: boolean;
  component: React.ComponentType<ModuleProps>;
}
