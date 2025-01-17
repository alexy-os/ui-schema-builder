import { ComponentRegistryItem, ComponentSchema } from './types';

class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentRegistryItem> = new Map();

  private constructor() {}

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  register(name: string, component: React.ComponentType<any>, schema: ComponentSchema) {
    if (this.components.has(name)) {
      console.warn(`Component ${name} is already registered. It will be overwritten.`);
    }
    this.components.set(name, { name, component, schema });
  }

  get(name: string): ComponentRegistryItem | undefined {
    return this.components.get(name);
  }

  getAll(): ComponentRegistryItem[] {
    return Array.from(this.components.values());
  }

  async installDependencies(component: ComponentSchema) {
    if (!component.dependencies?.length) return;
    
    // Here we'll implement dependency installation logic
    // This will use shadcn-ui CLI or npm/bun to install required packages
  }
}

export const registry = ComponentRegistry.getInstance(); 