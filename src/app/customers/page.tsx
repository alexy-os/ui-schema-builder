'use client';

import { customersPageSchema } from '@/schemas/customers';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Row } from '@tanstack/react-table';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
  },
];

export default function CustomersPage() {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      enableSorting: true,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<Customer> }) => {
        const status = row.getValue('status') as Customer['status'];
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: Row<Customer> }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.chevronsUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('Edit', row.original)}>
                <Icons.pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Delete', row.original)}>
                <Icons.trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={mockCustomers}
        filtering={{
          enabled: true,
          fields: ['name', 'email', 'status'],
        }}
        sorting={{
          enabled: true,
          fields: ['name', 'status'],
        }}
        pagination={{
          enabled: true,
          pageSize: 10,
        }}
      />
    </div>
  );
} 