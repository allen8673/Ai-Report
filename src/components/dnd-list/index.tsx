'use client'

import _ from "lodash";
import { useEffect, useState } from "react";
import { DragDropContext, DragStart, Draggable, DropResult, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Element } from 'react-scroll'
import { v4 } from 'uuid'

import { DndContextProps, DndDroppableProps, DndItemProps, DndListProps } from "./dnd-list"

const DndContext = <T extends { [key: string]: any }>({
    items,
    className,
    style,
    onDragStart,
    onDragEnd,
    children,
}: DndContextProps<T>): JSX.Element => {
    const dndOnDragEnd = (result: DropResult): void => {
        if (!result.source || !result.destination) return;
        const resultItems = _.cloneDeep(items);
        resultItems.splice(result.destination.index, 0, resultItems.splice(result.source.index, 1)[0]);
        onDragEnd(result, resultItems);
        return;
    };
    const dndOnDragStart = (initial: DragStart): void => {
        onDragStart?.(initial, items[initial.source.index]);
    };
    return (
        <div id="dnd-context" className={className} style={style} >
            <DragDropContext onDragEnd={dndOnDragEnd} onDragStart={dndOnDragStart}>
                {children(items)}
            </DragDropContext>
        </div>
    );
};

const DndDroppable = <T extends { [key: string]: any }>({
    items = [],
    droppableId,
    type,
    children,
    className
}: DndDroppableProps<T>): JSX.Element => {
    const [id] = useState<string>(droppableId || v4());
    return (
        <Droppable key={id} droppableId={id} type={type || v4()}>
            {(provided: DroppableProvided): JSX.Element => (
                <div id='dnd-droppable' className={className} ref={provided.innerRef}>
                    {children(items, provided)}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

const RbDndItem = <T extends { [key: string]: any }>({
    item,
    index,
    renderContent,
    isDragDisabled,
    onClickItem,
    onMouseDownItem,
    idPath = 'id',
    disableWholeDraghandle,
}: DndItemProps<T>): JSX.Element => {
    const id = _.get(item, idPath) || `dnd-id-${index}`;
    return (
        <Element
            key={index}
            className="dnd-item"
            name={item?.id || ''}
            onClick={(): void => {
                onClickItem?.(item);
            }}
            onMouseDown={(): void => {
                onMouseDownItem?.(item);
            }}
            style={{ cursor: 'pointer' }}
        >
            <Draggable key={id} draggableId={id} index={index} isDragDisabled={isDragDisabled} >
                {(provided): JSX.Element => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...(!!disableWholeDraghandle ? {} : provided.dragHandleProps)} // sets the whole element as drag handle
                    >
                        {renderContent(item, provided)}
                    </div>
                )}
            </Draggable>
        </Element>
    );
};

export default function DndList<T extends { [key: string]: any }>({
    renderContent,
    items,
    className,
    isDragDisabled,
    onClickItem,
    onMouseDownItem,
    itemStyle,
    idPath,
    droppableId,
    onDragStart,
    onDragEnd,
    style,
    disableWholeDraghandle,
    disableChangeOrder,
}: DndListProps<T>) {
    const [_items, setItems] = useState<T[]>(items || []);
    _items.map
    const dewfaultDragEnd = (result: DropResult): void => {
        if (!disableChangeOrder) {
            // default behavior is move the item according to dropdown position
            setItems((pre) => {
                pre.splice(result?.destination?.index || 0, 0, pre.splice(result.source.index, 1)[0]);
                return [...pre];
            });
        }
    };

    useEffect(() => {
        if (!items) return;
        setItems(items);
    }, [items]);

    return <DndContext className={`w-full h-full ${className || ''}`} {...{ style, onDragStart, onDragEnd: onDragEnd || dewfaultDragEnd, items: _items }}>
        {(_items): JSX.Element => (
            <DndDroppable className="h-full" items={_items} droppableId={droppableId}>
                {(_items): React.JSX.Element[] =>
                    _items.map((item, index: number) => {
                        return (
                            <RbDndItem
                                key={index}
                                item={item}
                                index={index}
                                renderContent={(item, provided): JSX.Element => renderContent(item, index, provided)}
                                isDragDisabled={isDragDisabled}
                                onClickItem={onClickItem}
                                onMouseDownItem={onMouseDownItem}
                                itemStyle={itemStyle}
                                idPath={idPath}
                                disableWholeDraghandle={disableWholeDraghandle}
                            />
                        );
                    })
                }
            </DndDroppable>
        )}
    </DndContext>
}