'use client'

import _ from "lodash";
import { ForwardedRef, Ref, RefObject, forwardRef, useEffect, useRef, useState } from "react";
import { DragDropContext, DragStart, Draggable, DropResult, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Element } from 'react-scroll'
import { v4 } from 'uuid'

import { DndContextProps, DndDroppableProps, DndItemProps, DndListProps } from "./dnd-list"

type GenericType = { [key: string]: any } | string;

const DndContext = <T extends GenericType>({
    id,
    items,
    className,
    style,
    onDragStart,
    onDragEnd,
    children,
}: DndContextProps<T>, ref: Ref<HTMLDivElement> | null): JSX.Element => {
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
        <div id={id || "dnd-context"} className={className} style={style} ref={ref}>
            <DragDropContext onDragEnd={dndOnDragEnd} onDragStart={dndOnDragStart}>
                {children(items)}
            </DragDropContext>
        </div>
    );
};

const DndContextByRef = forwardRef(DndContext) as <T extends GenericType>(
    props: DndContextProps<T> & { ref?: ForwardedRef<HTMLDivElement> })
    => ReturnType<typeof DndContext>;

const DndDroppable = <T extends GenericType>({
    items = [],
    droppableId,
    type,
    children,
    className,
    direction,
}: DndDroppableProps<T>): JSX.Element => {
    const [id] = useState<string>(droppableId || v4());
    return (
        <Droppable key={id} droppableId={id} type={type || v4()} direction={direction}>
            {(provided: DroppableProvided): JSX.Element => (
                <div id='dnd-droppable' className={`${className} ${direction === 'horizontal' ? 'flex' : ''}`} ref={provided.innerRef}>
                    {children(items, provided)}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

const RbDndItem = <T extends { [key: string]: any } | string>({
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
            name={(typeof item === 'string' ? item : item?.id) || ''}
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

function DndList<T extends { [key: string]: any } | string>({
    id,
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
    direction,
    onChange,
}: DndListProps<T>, ref: Ref<HTMLDivElement> | null) {
    const _initRef = useRef(null);
    const _innerRef = ref || _initRef;
    const [_items, setItems] = useState<T[]>(items || []);
    const dewfaultDragEnd = (result: DropResult): void => {
        if (!disableChangeOrder) {
            // default behavior is move the item according to dropdown position
            setItems((pre) => {
                pre.splice(result?.destination?.index || 0, 0, pre.splice(result.source.index, 1)[0]);
                onChange?.(pre);
                return [...pre];
            });
        }
    };

    useEffect(() => {
        if (!items) return;
        setItems(items);
    }, [items]);

    /**
     * set the roller beheavior by the direction 
     */
    useEffect(() => {
        const current = (_innerRef as RefObject<HTMLDivElement>)?.current
        if (!current || direction === 'vertical') return;

        const onWheel = (e: any) => {
            if (e.deltaY == 0) return;
            e.preventDefault();
            current.scrollTo({
                left: current.scrollLeft + e.deltaY,
                behavior: "smooth"
            });
        };
        current.addEventListener("wheel", onWheel);
        return () => current.removeEventListener("wheel", onWheel);
    }, [direction])

    let layoutClass = ''
    switch (direction) {
        case 'horizontal':
            layoutClass = 'w-full';
            break;
        case 'vertical':
            layoutClass = 'h-full'
            break;
    }

    return <DndContextByRef
        id={id}
        className={`${className || `${layoutClass} overflow-auto no-scrollbar`}`}
        {...{ style, onDragStart, onDragEnd: onDragEnd || dewfaultDragEnd, items: _items }}
        ref={_innerRef}
    >
        {(_items): JSX.Element => (
            <DndDroppable className={`${layoutClass}`} items={_items} droppableId={droppableId} direction={direction}>
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
    </DndContextByRef>
}

export default forwardRef(DndList) as <T extends { [key: string]: any } | string>(
    props: DndListProps<T> & { ref?: ForwardedRef<HTMLDivElement> })
    => ReturnType<typeof DndList>;