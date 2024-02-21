
import { map, some } from 'lodash';
import { Column as ColumnComp, } from 'primereact/column';
import { DataTable, DataTableFilterMeta, } from 'primereact/datatable';

import ErrorBoundary from '../error-boundary';

import { TableProps } from './table';

export default function Table<T extends Record<string, any>>({ className, columns, value, key, ...tableProps }: TableProps<T>) {
    const table_key = key || 'table';

    const filterMeta: DataTableFilterMeta | undefined =
        some(columns, c => c.filter) ?
            columns.reduce<DataTableFilterMeta>((result, column) => {
                if (column.filter && column.key) {
                    result[column.key as string] = { value: null, matchMode: column.filterMatchMode || 'contains' }
                }
                return result
            }, {}) :
            undefined;

    return <ErrorBoundary>
        <DataTable
            className={`zd-table ${className || ''}`}
            key={table_key}
            value={value}
            selectionMode="single"
            dataKey="id"
            tableStyle={{ minWidth: '50rem' }}
            filters={filterMeta}
            {...tableProps}>
            {map(columns, ({ key, header: title, body: format, ...c }, idx) => {
                const col_key = (key as string) || idx
                return (
                    <ColumnComp
                        key={`${table_key}-col-${col_key}`}
                        field={key as string}
                        header={title}
                        body={format}
                        className='ellipsis'
                        {...c}
                    />
                )
            })}
        </DataTable >
    </ErrorBoundary>
}