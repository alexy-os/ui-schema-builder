import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { PageSchema, ComponentSchema } from './types';
import { registry } from './registry';

interface SchemaComponent {
  type: string;
  properties?: {
    children?: Array<SchemaComponent | string> | SchemaComponent | string;
    [key: string]: any;
  };
}

export class SchemaGenerator {
  private static instance: SchemaGenerator;
  private schemasDir = path.join(process.cwd(), 'src/schemas');
  private pagesDir = path.join(process.cwd(), 'src/app');

  private constructor() {}

  static getInstance(): SchemaGenerator {
    if (!SchemaGenerator.instance) {
      SchemaGenerator.instance = new SchemaGenerator();
    }
    return SchemaGenerator.instance;
  }

  async generatePages() {
    const schemas = await this.loadSchemas();
    for (const [name, schema] of Object.entries(schemas)) {
      await this.generatePage(name, schema);
    }
  }

  private async loadSchemas(): Promise<Record<string, PageSchema>> {
    const schemas: Record<string, PageSchema> = {};
    const files = await fs.readdir(this.schemasDir);
    
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const name = path.basename(file, '.ts');
        const schema = require(path.join(this.schemasDir, file));
        schemas[name] = schema.default || schema[`${name}PageSchema`];
      }
    }
    
    return schemas;
  }

  private async generatePage(name: string, schema: PageSchema) {
    // Create page directory
    const pageDir = path.join(this.pagesDir, name);
    await fs.mkdir(pageDir, { recursive: true });

    // Install required components
    await this.installRequiredComponents(schema);

    // Generate page content
    const pageContent = this.generatePageContent(name, schema);
    await fs.writeFile(
      path.join(pageDir, 'page.tsx'),
      pageContent,
      'utf-8'
    );
  }

  private async installRequiredComponents(schema: PageSchema) {
    const requiredComponents = new Set<string>();

    // Analyze schema to find required components
    const analyzeComponent = (component: ComponentSchema) => {
      if (component.dependencies) {
        component.dependencies.forEach(dep => requiredComponents.add(dep));
      }
    };

    const processComponent = (component: SchemaComponent) => {
      const registeredComponent = registry.get(component.type);
      if (registeredComponent?.schema) {
        analyzeComponent(registeredComponent.schema);
      }

      // Process children components
      if (component.properties?.children) {
        const children = Array.isArray(component.properties.children)
          ? component.properties.children
          : [component.properties.children];
        
        children.forEach(child => {
          if (typeof child === 'object' && 'type' in child) {
            processComponent(child as SchemaComponent);
          }
        });
      }
    };

    schema.components.forEach(processComponent);

    // Install components using shadcn-ui
    if (requiredComponents.size > 0) {
      const components = Array.from(requiredComponents);
      execSync(`bun x shadcn@latest add ${components.join(' ')}`, {
        stdio: 'inherit',
      });
    }
  }

  private generatePageContent(name: string, schema: PageSchema): string {
    return `'use client';

import { useState, useEffect } from 'react';
import { ${name}PageSchema } from '@/schemas/${name}';
${this.generateImports(schema)}

export default function ${this.capitalizeFirst(name)}Page() {
  ${this.generatePageBody(schema)}
}`;
  }

  private generateImports(schema: PageSchema): string {
    const imports = new Set<string>();
    
    const processComponent = (component: SchemaComponent) => {
      imports.add(`import { ${component.type} } from '@/components/ui/${component.type.toLowerCase()}';`);

      // Process children components
      if (component.properties?.children) {
        const children = Array.isArray(component.properties.children)
          ? component.properties.children
          : [component.properties.children];
        
        children.forEach(child => {
          if (typeof child === 'object' && 'type' in child) {
            processComponent(child as SchemaComponent);
          }
        });
      }
    };

    schema.components.forEach(processComponent);

    return Array.from(imports).join('\n');
  }

  private generatePageBody(schema: PageSchema): string {
    const generateComponent = (component: SchemaComponent): string => {
      const props = { ...component.properties };
      
      // Process children
      if (props.children) {
        if (Array.isArray(props.children)) {
          props.children = props.children
            .map(child => {
              if (typeof child === 'object' && 'type' in child) {
                return generateComponent(child as SchemaComponent);
              }
              return JSON.stringify(child);
            })
            .join(',\n          ');
        } else if (typeof props.children === 'object' && 'type' in props.children) {
          props.children = generateComponent(props.children as SchemaComponent);
        }
      }

      return `<${component.type}
        ${Object.entries(props)
          .map(([key, value]) => {
            if (key === 'children') {
              return `${key}={[${value}]}`;
            }
            return `${key}={${JSON.stringify(value)}}`;
          })
          .join('\n        ')}
      />`;
    };

    const components = schema.components.map(generateComponent);

    return `return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">${schema.title}</h1>
      ${components.join('\n      ')}
    </div>
  );`;
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const generator = SchemaGenerator.getInstance(); 