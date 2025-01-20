import { z } from 'zod';
import { Icons } from '@/components/ui/icons';

// Базовые типы
const i18nString = z.object({
  i18n: z.literal(true),
  key: z.string(),
});

const columnHeader = z.union([z.string(), i18nString]);

const iconNames = z.enum(Object.keys(Icons) as [keyof typeof Icons, ...Array<keyof typeof Icons>]);

// Схема для элементов меню действий
const menuItem = z.object({
  label: z.union([z.string(), i18nString]),
  icon: iconNames.optional(),
  action: z.string(),
  variant: z.string().optional(),
});

// Схема для специальных ячеек
const cellTypes = z.enum(['Badge', 'DropdownMenu']);

// Схема для свойств ячейки DropdownMenu
const dropdownMenuProperties = z.object({
  items: z.array(menuItem),
});

// Схема для колонки таблицы
export const tableColumn = z.object({
  id: z.string(),
  header: columnHeader,
  accessorKey: z.string().optional(),
  cell: z.union([cellTypes, z.function()]).optional(),
  enableSorting: z.boolean().optional(),
  properties: dropdownMenuProperties.optional(),
});

// Схема для конфигурации фильтрации
const filteringConfig = z.object({
  enabled: z.boolean(),
  fields: z.array(z.string()),
});

// Схема для конфигурации сортировки
const sortingConfig = z.object({
  enabled: z.boolean(),
  fields: z.array(z.string()),
});

// Схема для конфигурации пагинации
const paginationConfig = z.object({
  enabled: z.boolean(),
  pageSize: z.number(),
});

// Основная схема таблицы
export const tableSchema = z.object({
  columns: z.array(tableColumn),
  filtering: filteringConfig.optional(),
  sorting: sortingConfig.optional(),
  pagination: paginationConfig.optional(),
});

// Типы на основе схем
export type TableColumn = z.infer<typeof tableColumn>;
export type TableSchema = z.infer<typeof tableSchema>;

// Функция для валидации конфигурации таблицы
export function validateTableConfig(config: unknown): TableSchema {
  return tableSchema.parse(config);
}

// Функция для валидации колонки
export function validateTableColumn(column: unknown): TableColumn {
  return tableColumn.parse(column);
} 