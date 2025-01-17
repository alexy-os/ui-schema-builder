import { ReactNode } from 'react';

export interface UISchema {
  version: string;
  theme: ThemeConfig;
  components: Record<string, ComponentSchema>;
  layouts: Record<string, LayoutSchema>;
  pages: Record<string, PageSchema>;
}

export interface ThemeConfig {
  style: 'new-york' | 'default';
  baseColor: string;
  primaryColor: string;
  radius: string;
  darkMode: boolean;
}

export interface ComponentSchema {
  type: string;
  properties: Record<string, PropertySchema>;
  variants?: Record<string, VariantSchema>;
  behaviors?: BehaviorSchema[];
  dependencies?: string[];
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  default?: any;
  i18n?: boolean;
}

export interface VariantSchema {
  properties: Record<string, PropertySchema>;
  styles?: Record<string, string>;
}

export interface BehaviorSchema {
  type: string;
  config: Record<string, any>;
}

export interface LayoutSchema {
  type: string;
  regions: string[];
  properties?: Record<string, PropertySchema>;
}

export interface PageSchema {
  layout: string;
  title: string;
  components: ComponentInstance[];
  data?: DataSchema;
}

export interface ComponentInstance {
  id: string;
  type: string;
  region: string;
  properties: Record<string, any>;
  children?: ComponentInstance[];
}

export interface DataSchema {
  source: string;
  query?: Record<string, any>;
  transform?: (data: any) => any;
}

export interface ComponentRegistryItem {
  name: string;
  component: React.ComponentType<any>;
  schema: ComponentSchema;
} 