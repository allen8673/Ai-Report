import { ColumnProps } from 'primereact/column';
import { DataTablePropsSingle } from 'primereact/datatable';

export interface Column<T extends Record<string, any>> extends Omit<ColumnProps, 'field' | 'key' | 'header' | 'body' | 'filterFunction'> {
    // column key
    key?: keyof T;
    // column title
    header?: React.ReactNode;
    // 渲染column內容
    body?: (row: T) => JSX.Element | string | number;
    // 自定義filter邏輯
    filterFunction?: (value: any, filter: any) => boolean;
}

export interface TableProps<T extends Record<string, any>> extends Omit<DataTablePropsSingle<Array<T>>, 'value'> {
    columns: Column<T>[];
    value: T[];
}