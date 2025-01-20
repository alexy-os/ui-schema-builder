import * as React from 'react';
import { DataTable } from '@/components/ui/data-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { registry } from './registry';

// Register DataTable component
registry.register('DataTable', DataTable, {
  type: 'DataTable',
  properties: {
    config: {
      type: 'object',
      required: true,
    },
    data: {
      type: 'array',
      required: true,
    },
  },
  dependencies: ['table', 'button', 'input', 'dropdown-menu', 'badge'],
});

// Register Card components
registry.register('Card', Card, {
  type: 'Card',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'array',
      required: true,
    },
  },
  dependencies: ['card'],
});

registry.register('CardHeader', CardHeader, {
  type: 'CardHeader',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'array',
      required: true,
    },
  },
});

registry.register('CardTitle', CardTitle, {
  type: 'CardTitle',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'string',
      required: true,
    },
  },
});

registry.register('CardDescription', CardDescription, {
  type: 'CardDescription',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'string',
      required: true,
    },
  },
});

registry.register('CardContent', CardContent, {
  type: 'CardContent',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'array',
      required: true,
    },
  },
});

// Register Button component
registry.register('Button', Button, {
  type: 'Button',
  properties: {
    variant: {
      type: 'string',
      required: false,
    },
    size: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'array',
      required: true,
    },
  },
  dependencies: ['button'],
});

// Register Link component
registry.register('Link', Link, {
  type: 'Link',
  properties: {
    href: {
      type: 'string',
      required: true,
    },
    children: {
      type: 'array',
      required: true,
    },
  },
});

// Register Icon component
const IconComponent: React.FC<{ name: keyof typeof Icons; className?: string }> = ({ name, className }) => {
  const Icon = Icons[name.toLowerCase() as keyof typeof Icons];
  if (!Icon) return null;
  return React.createElement(Icon, { className });
};

registry.register('Icon', IconComponent, {
  type: 'Icon',
  properties: {
    name: {
      type: 'string',
      required: true,
    },
    className: {
      type: 'string',
      required: false,
    },
  },
});

// Register basic HTML elements
const Div: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => 
  React.createElement('div', { className }, children);

const Paragraph: React.FC<{ className?: string; children: string }> = ({ className, children }) => 
  React.createElement('p', { className }, children);

registry.register('div', Div, {
  type: 'div',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'array',
      required: true,
    },
  },
});

registry.register('p', Paragraph, {
  type: 'p',
  properties: {
    className: {
      type: 'string',
      required: false,
    },
    children: {
      type: 'string',
      required: true,
    },
  },
}); 