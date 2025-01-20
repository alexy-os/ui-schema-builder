import { TableSchema } from '@/core/schemas/table';

export interface DataTableProps<TData> {
  config: TableSchema;
  data: TData[];
} 