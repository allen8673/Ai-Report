
import _ from 'lodash';
import { Column, } from 'primereact/column';
import { DataTable, } from 'primereact/datatable';

import { TableProps } from './table';

export default function Table<T extends Record<string, any>>({ className, columns, data, key, ...tableProps }: TableProps<T>) {
    const table_key = key || 'table';
    return <DataTable
        className={`zd-table ${className || ''}`}
        key={table_key}
        value={data}
        selectionMode="single"
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}
        {...tableProps}>
        {_.map(columns, ({ key, title, format, ...c }, idx) => {
            const col_key = (key as string) || idx
            return (
                <Column
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
}