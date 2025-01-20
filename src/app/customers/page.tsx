'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { dataService } from '@/core/data-service';
import { TableSchema } from '@/core/schemas/table';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const tableConfig: TableSchema = {
  "columns": [
    {
      "id": "name",
      "header": {
        "i18n": true,
        "key": "customers.name"
      },
      "accessorKey": "name",
      "enableSorting": true
    },
    {
      "id": "email",
      "header": {
        "i18n": true,
        "key": "customers.email"
      },
      "accessorKey": "email"
    },
    {
      "id": "status",
      "header": {
        "i18n": true,
        "key": "customers.status"
      },
      "accessorKey": "status",
      "cell": "Badge"
    },
    {
      "id": "actions",
      "header": "",
      "cell": "DropdownMenu",
      "properties": {
        "items": [
          {
            "label": {
              "i18n": true,
              "key": "actions.edit"
            },
            "icon": "pencil",
            "action": "edit"
          },
          {
            "label": {
              "i18n": true,
              "key": "actions.delete"
            },
            "icon": "trash",
            "action": "delete",
            "variant": "destructive"
          }
        ]
      }
    }
  ],
  "filtering": {
    "enabled": true,
    "fields": [
      "name",
      "email",
      "status"
    ]
  },
  "sorting": {
    "enabled": true,
    "fields": [
      "name",
      "status"
    ]
  },
  "pagination": {
    "enabled": true,
    "pageSize": 10
  }
};

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const source = dataService.getSource<Customer>('customers');
        if (source) {
          const result = await source.getData({"limit":10,"offset":0});
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
      <h1 className="text-3xl font-bold tracking-tight mb-6">Customers</h1>
      <DataTable<Customer>
        config={tableConfig}
        data={data}
      />
    </div>
  );
}