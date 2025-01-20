import fs from 'fs/promises';
import path from 'path';
import { TableSchema } from '@/core/schemas/table';

interface PageConfig {
  path: string;
  title: string;
  component: {
    type: string;
    config: TableSchema;
    data: {
      source: string;
      type: string;
      query: Record<string, any>;
    };
  };
}

export class PageGenerator {
  private static instance: PageGenerator;
  private schemasDir = path.join(process.cwd(), 'src/schemas');
  private pagesDir = path.join(process.cwd(), 'src/app');

  private constructor() {}

  static getInstance(): PageGenerator {
    if (!PageGenerator.instance) {
      PageGenerator.instance = new PageGenerator();
    }
    return PageGenerator.instance;
  }

  async generatePages() {
    const schemas = await this.loadSchemas();
    for (const schema of schemas) {
      await this.generatePage(schema);
    }
  }

  private async loadSchemas(): Promise<PageConfig[]> {
    const schemas: PageConfig[] = [];
    const files = await fs.readdir(this.schemasDir);
    
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const schema = require(path.join(this.schemasDir, file));
        if (schema.customersPageConfig) {
          schemas.push(schema.customersPageConfig);
        }
      }
    }
    
    return schemas;
  }

  private async generatePage(config: PageConfig) {
    const pagePath = path.join(this.pagesDir, config.path.slice(1));
    await fs.mkdir(pagePath, { recursive: true });

    const pageContent = this.generatePageContent(config);
    await fs.writeFile(
      path.join(pagePath, 'page.tsx'),
      pageContent,
      'utf-8'
    );
  }

  private generatePageContent(config: PageConfig): string {
    if (config.component.type === 'DataTable') {
      return this.generateDataTablePage(config);
    }
    throw new Error(`Unsupported component type: ${config.component.type}`);
  }

  private generateDataTablePage(config: PageConfig): string {
    return `'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { dataService } from '@/core/data-service';
import { TableSchema } from '@/core/schemas/table';

interface ${config.component.data.type} {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const tableConfig: TableSchema = ${JSON.stringify(config.component.config, null, 2)};

export default function ${this.capitalizeFirst(config.path.slice(1))}Page() {
  const [data, setData] = useState<${config.component.data.type}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const source = dataService.getSource<${config.component.data.type}>('${config.component.data.source}');
        if (source) {
          const result = await source.getData(${JSON.stringify(config.component.data.query)});
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">${config.title}</h1>
      <DataTable<${config.component.data.type}>
        config={tableConfig}
        data={data}
      />
    </div>
  );
}`;
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const pageGenerator = PageGenerator.getInstance(); 