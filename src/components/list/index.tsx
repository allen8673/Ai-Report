import { size } from "lodash";
import { useMemo } from "react";
import { List as RV_list, AutoSizer, CellMeasurer, CellMeasurerCache, ListRowProps } from 'react-virtualized';

import { ListProps } from "./list";


export default function List<T,>(props: ListProps<T>) {
    const { className, style, data = [], renderItem, onItemClick } = props;

    const cellCatch = useMemo(
        () =>
            new CellMeasurerCache({
                fixedWidth: true,
                defaultHeight: 10,
            }),
        []
    );

    const _renderItem = ({ index, key, style, parent }: ListRowProps) => {
        const item = data[index];
        return (
            <CellMeasurer key={key} parent={parent} columnIndex={0} rowIndex={index} cache={cellCatch}>
                <div
                    className="container-item"
                    key={key}
                    style={{ ...style, height: 'fit-content' }}
                    role='presentation'
                    onClick={(): void => {
                        onItemClick?.(item);
                    }}
                >
                    {renderItem(item, index)}
                </div>
            </CellMeasurer>
        );
    };

    return (
        <div className={`h-full overflow-hidden ${className}`} style={style}>
            <AutoSizer>
                {({ width, height }) => {
                    return (
                        <RV_list
                            width={width}
                            height={height}
                            rowHeight={cellCatch.rowHeight}
                            deferredMeasurementCache={cellCatch}
                            rowRenderer={_renderItem}
                            rowCount={size(data)}
                            overscanRowCount={5}
                        />
                    );
                }}
            </AutoSizer>
        </div>
    )
}