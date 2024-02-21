import { ColumnProps } from 'primereact/column';
import { DataTablePropsSingle } from 'primereact/datatable';

export interface Column<T extends Record<string, any>> extends Omit<ColumnProps, 'field' | 'key' | 'header' | 'body'> {
    // column key
    key?: keyof T;
    // column title
    header?: React.ReactNode;
    // 渲染column內容
    body?: (row: T) => JSX.Element | string | number;
}

export interface TableProps<T extends Record<string, any>> extends Omit<DataTablePropsSingle<Array<T>>, 'value'> {
    columns: Column<T>[];
    value: T[];
}