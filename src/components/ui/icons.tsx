import {
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Plus,
  X,
  Check,
  Users,
  Github,
  LucideProps,
  LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  pencil: Pencil,
  trash: Trash,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronsUpDown: ChevronsUpDown,
  plus: Plus,
  x: X,
  check: Check,
  users: Users,
  github: Github,
} as const; 