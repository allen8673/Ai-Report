
import { map } from 'lodash';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { Column as ColumnComp, } from 'primereact/column';
import { DataTable, DataTableFilterMeta, } from 'primereact/datatable';
import { useEffect, useState } from 'react';

import ErrorBoundary from '../error-boundary';

import { Column, TableProps } from './table';

export default function Table<T extends Record<string, any>>({ className, columns, value, key, ...tableProps }: TableProps<T>) {
    const table_key = key || 'table';

    const [filterMeta, setFilterMeta] = useState<DataTableFilterMeta | undefined>();
    const [innerColumns, setInnerColumns] = useState<Column<T>[]>([]);

    useEffect(() => {
        let _filterMeta: DataTableFilterMeta | undefined;
        const _columns: Column<T>[] = columns.reduce<Column<T>[]>((result, column) => {

            let _column: Column<T> = column;

            if (!column.key) {
                result.push(_column);
                return result;
            }

            // 如果有自定義filterFunction，則註冊到FilterService
            // 並將filterFunction移除，改為使用CUSTOM模式
            if (!!column.filterFunction) {
                FilterService.register(`custom_${(column.key as string)}`, column.filterFunction);
                _column = { ...column, filterMatchMode: FilterMatchMode.CUSTOM, filterFunction: undefined, showFilterMenuOptions: false };
            }

            // 如果有filter，則設定filterMeta
            if (column.filter) {
                _filterMeta = _filterMeta || {};
                _filterMeta[column.key as string] = { value: null, matchMode: _column.filterMatchMode || 'contains' }
            }

            result.push(_column);
            return result;
        }, []);

        setInnerColumns(_columns);
        setFilterMeta(_filterMeta)
    }, [columns])

    return (
        <ErrorBoundary>
            <DataTable
                className={`zd-table ${className || ''}`}
                key={table_key}
                value={value}
                selectionMode="single"
                dataKey="id"
                tableStyle={{ minWidth: '50rem' }}
                filters={filterMeta}
                {...tableProps}>
                {map(innerColumns, ({ key, ...c }, idx) => {
                    const col_key = (key as string) || idx
                    return (
                        <ColumnComp
                            key={`${table_key}-col-${col_key}`}
                            field={key as string}
                            className='ellipsis'
                            {...c}
                        />
                    )
                })}
            </DataTable >
        </ErrorBoundary>
    )
}