# UI Schema Builder

A powerful Next.js-based framework for generating dynamic data tables and UI components using schema definitions. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

> **NOTE:** This is a experimental project for LLM autocompletion and work in progress.

## Features

- **Schema-Driven Development**: Define your UI components using TypeScript schemas
- **Type-Safe Tables**: Generate fully typed data tables with Zod validation
- **Modern UI Components**: Built on top of shadcn/ui and Radix UI primitives
- **Dark Mode Support**: Built-in dark mode with customizable themes
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Advanced Table Features**:
  - Sorting
  - Filtering
  - Pagination
  - Custom cell renderers
  - Action menus
  - i18n support for headers

## Quick Start

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ui-schema-builder

# Install dependencies
bun install

# Start development server
bun run dev
```

The application will be available at `http://localhost:3000`.

## Framework Architecture

### Schema Definition

Create table schemas in `src/schemas` directory:

```typescript
// src/schemas/customers.ts
export const customersTableConfig: TableSchema = {
  columns: [
    {
      id: "name",
      header: { i18n: true, key: "customers.name" },
      accessorKey: "name",
      enableSorting: true,
    },
    // ... more columns
  ],
  filtering: {
    enabled: true,
    fields: ["name", "email", "status"],
  },
  sorting: {
    enabled: true,
    fields: ["name", "status"],
  },
  pagination: {
    enabled: true,
    pageSize: 10,
  },
};
```

### Page Configuration

Define page configurations to automatically generate routes:

```typescript
export const customersPageConfig = {
  path: "/customers",
  title: "Customers",
  component: {
    type: "DataTable",
    config: customersTableConfig,
    data: {
      source: "customers",
      type: "Customer",
      query: {
        limit: 10,
        offset: 0,
      },
    },
  },
};
```

### Data Sources

Implement data sources in `src/core/data-service.ts`:

```typescript
interface DataSource<T> {
  getData(query?: Record<string, any>): Promise<T[]>;
}

// Register your data sources
dataService.registerSource('customers', {
  getData: async () => {
    // Implement your data fetching logic
  }
});
```

## Development Workflow

1. **Define Schema**: Create a new schema file in `src/schemas`
2. **Configure Page**: Add page configuration with routing and component settings
3. **Register Data Source**: Implement and register a data source
4. **Run Generator**: The framework automatically generates pages on `bun run dev`

## Configuration

### Tailwind CSS

The framework uses Tailwind CSS for styling. Customize the theme in:
- `tailwind.config.ts`: Core Tailwind configuration
- `src/lib/theme.ts`: Theme variables and dark mode settings
- `src/app/globals.css`: Global styles and CSS variables

### Components

Custom components are registered in `src/core/components.ts`. Each component can define:
- Properties schema
- Dependencies
- Variants
- Behaviors

## Available Scripts

- `bun run dev`: Start development server with hot reload
- `bun run build`: Build for production
- `bun run start`: Start production server
- `bun run generate`: Generate pages from schemas manually

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.
