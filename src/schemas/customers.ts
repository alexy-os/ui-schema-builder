import { TableSchema } from '@/core/schemas/table';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export const customersTableConfig: TableSchema = {
  columns: [
    {
      id: 'name',
      header: { i18n: true, key: 'customers.name' },
      accessorKey: 'name',
      enableSorting: true,
    },
    {
      id: 'email',
      header: { i18n: true, key: 'customers.email' },
      accessorKey: 'email',
    },
    {
      id: 'status',
      header: { i18n: true, key: 'customers.status' },
      accessorKey: 'status',
      cell: 'Badge',
    },
    {
      id: 'actions',
      header: '',
      cell: 'DropdownMenu',
      properties: {
        items: [
          {
            label: { i18n: true, key: 'actions.edit' },
            icon: 'pencil',
            action: 'edit',
          },
          {
            label: { i18n: true, key: 'actions.delete' },
            icon: 'trash',
            action: 'delete',
            variant: 'destructive',
          },
        ],
      },
    },
  ],
  filtering: {
    enabled: true,
    fields: ['name', 'email', 'status'],
  },
  sorting: {
    enabled: true,
    fields: ['name', 'status'],
  },
  pagination: {
    enabled: true,
    pageSize: 10,
  },
};

export const customersPageConfig = {
  path: '/customers',
  title: 'Customers',
  component: {
    type: 'DataTable',
    config: customersTableConfig,
    data: {
      source: 'customers',
      type: 'Customer',
      query: {
        limit: 10,
        offset: 0,
      },
    },
  },
}; 