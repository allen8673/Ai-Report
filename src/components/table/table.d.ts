import { ColumnProps } from 'primereact/column';
import { DataTablePropsSingle } from 'primereact/datatable';

export interface Column<T extends Record<string, any>> extends Omit<ColumnProps, 'field' | 'key' | 'header' | 'body'> {
    key?: keyof T;
    title?: React.ReactNode;
    format?: (row: T) => JSX.Element | string | number;
}

export interface TableProps<T extends Record<string, any>> extends Omit<DataTablePropsSingle<Array<T>>, 'value'> {
    columns: Column<T>[];
    data: T[];
}