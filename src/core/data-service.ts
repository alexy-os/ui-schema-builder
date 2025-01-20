export interface DataSource<T = any> {
  getData(query?: Record<string, any>): Promise<T[]>;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

class MockDataService {
  private sources: Record<string, DataSource<any>> = {
    customers: {
      getData: async (): Promise<Customer[]> => [
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
      ],
    },
  };

  getSource<T>(name: string): DataSource<T> | undefined {
    return this.sources[name] as DataSource<T>;
  }

  registerSource<T>(name: string, source: DataSource<T>) {
    this.sources[name] = source;
  }
}

export const dataService = new MockDataService(); 