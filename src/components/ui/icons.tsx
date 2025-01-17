import {
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Plus,
  X,
  Check,
  LucideProps,
  type Icon as LucideIcon,
} from 'lucide-react';

export type Icon = typeof LucideIcon;

export const Icons = {
  pencil: Pencil,
  trash: Trash,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronsUpDown: ChevronsUpDown,
  plus: Plus,
  x: X,
  check: Check,
} as const; 