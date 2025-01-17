import { PageSchema } from '../core/types';

export const customersPageSchema: PageSchema = {
  layout: 'default',
  title: 'Customers',
  components: [
    {
      id: 'customersTable',
      type: 'DataTable',
      region: 'main',
      properties: {
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
                  icon: 'Pencil',
                  action: 'edit'
                },
                {
                  label: { i18n: true, key: 'actions.delete' },
                  icon: 'Trash',
                  action: 'delete',
                  variant: 'destructive'
                }
              ]
            }
          }
        ],
        pagination: {
          enabled: true,
          pageSize: 10
        },
        filtering: {
          enabled: true,
          fields: ['name', 'email', 'status']
        },
        sorting: {
          enabled: true,
          fields: ['name', 'status']
        }
      }
    }
  ],
  data: {
    source: 'customers',
    query: {
      limit: 10,
      offset: 0
    }
  }
}; 