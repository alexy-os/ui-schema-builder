import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { TableColumn, validateTableConfig } from '@/core/schemas/table';
import { DataTableProps } from './types';

function processColumns<TData>(
  columns: TableColumn[]
): ColumnDef<TData, unknown>[] {
  return columns.map((column) => {
    const processedColumn = { ...column } as ColumnDef<TData, unknown>;

    // Process header with i18n
    if (typeof column.header === 'object' && column.header?.i18n) {
      processedColumn.header = column.header.key;
    }

    // Process special cell types
    if (column.cell === 'Badge') {
      processedColumn.cell = ({ row }) => {
        const value = row.getValue(column.id) as string;
        return (
          <Badge variant={value === 'active' ? 'default' : 'secondary'}>
            {value}
          </Badge>
        );
      };
    } else if (column.cell === 'DropdownMenu' && column.properties?.items) {
      processedColumn.cell = ({ row }) => {
        if (!column.properties?.items) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.chevronsUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {column.properties.items.map((item, index) => {
                const IconComponent = item.icon ? Icons[item.icon.toLowerCase() as keyof typeof Icons] : null;
                const label = typeof item.label === 'object' ? item.label.key : item.label;
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => console.log(item.action, row.original)}
                  >
                    {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                    {label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };
    }

    return processedColumn;
  });
}

export function DataTable<TData>({
  config,
  data,
}: DataTableProps<TData>) {
  // Validate config using Zod schema
  const validatedConfig = React.useMemo(() => validateTableConfig(config), [config]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sortingState, setSortingState] = React.useState<SortingState>([]);

  const columns = React.useMemo(
    () => processColumns<TData>(validatedConfig.columns),
    [validatedConfig.columns]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSortingState,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      sorting: sortingState,
    },
    initialState: {
      pagination: {
        pageSize: validatedConfig.pagination?.pageSize || 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {validatedConfig.filtering?.enabled && (
        <div className="flex items-center gap-2">
          {validatedConfig.filtering.fields.map((field) => (
            <Input
              key={field}
              placeholder={`Filter ${field}...`}
              value={(table.getColumn(field)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(field)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {validatedConfig.pagination?.enabled && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 