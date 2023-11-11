
import _ from 'lodash';
import { Column as Col_comp, } from 'primereact/column';
import { DataTable, } from 'primereact/datatable';

import { TableProps } from './table';

import './table.css'

export default function Table<T extends Record<string, any>>({ className, columns, data, key, ...tableProps }: TableProps<T>) {
    const table_key = key || 'table';
    return <DataTable className={`custom-table ${className || ''}`} key={table_key} value={data} selectionMode="single" dataKey="id" tableStyle={{ minWidth: '50rem' }} {...tableProps}>
        {_.map(columns, ({ key, title, format, ...c }, idx) => {
            const col_key = (key as string) || idx
            return (
                <Col_comp
                    key={`${table_key}-col-${col_key}`}
                    field={key as string}
                    header={title}
                    body={format}
                    {...c}
                />
            )
        })}
    </DataTable>
}