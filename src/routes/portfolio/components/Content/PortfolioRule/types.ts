import { NexoyaContentFilterOperator } from '../../../../../types';
import { ReactElement } from 'react';

export interface DataTableFilterOption {
  id: string;
  label: string;
  icon: ReactElement;
  value: string;
  options: Option[];
  type: FilterType;
  filterValues?: any[];
  filterOperator?: NexoyaContentFilterOperator;
  operators?: { label: string; value: NexoyaContentFilterOperator }[];
}

export interface Operator {
  label: string;
  value: NexoyaContentFilterOperator;
  humanReadable?: string;
}

export interface Option {
  label: string;
  value: string;
  icon?: ReactElement;
  withCount?: boolean;
}

export type FilterType = 'string' | 'number' | 'date' | 'numberArr' | 'stringArr' | 'boolean';
