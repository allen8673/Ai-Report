import { CSSProperties } from 'react';
import { DroppableProvided, DraggableProvided, DropResult, DragStart } from 'react-beautiful-dnd';

export interface DndContextProps<T> {
    items: T[];
    onSelectItem?: any;
    className?: string;
    onUnmount?: any;
    style?: CSSProperties;
    onDragStart?: (initial: DragStart, item: T | undefined) => void;
    onDragEnd: (result: DropResult, resultItems: T[]) => void;
    children: (_items: T[]) => JSX.Element | JSX.Element[];
}

export interface DndDroppableProps<T> {
    droppableId?: string;
    type?: string;
    index?: number;
    isDragDisabled?: boolean;
    items?: T[];
    onSelectItem?: any;
    onUnmount?: any;
    children: (_items: T[], provided: DroppableProvided) => JSX.Element | JSX.Element[];
    className?: string
}

export interface DndItemProps<T> {
    item: T;
    index: number;
    renderContent: (item: T, draggableProvided: DraggableProvided) => JSX.Element;
    isDragDisabled?: boolean;
    onClickItem?: (item: T) => void;
    onMouseDownItem?: (item: T) => void;
    itemStyle?: any;
    idPath?: string | string[];
    disableWholeDraghandle?: boolean;
}

export interface DndListProps<T> extends Omit<DndContextProps<T>, 'children' | 'items' | 'onDragEnd'> {
    items?: T[];
    droppableId?: string;
    isDragDisabled?: boolean;
    itemStyle?: any;
    idPath?: string | string[];
    disableWholeDraghandle?: boolean;
    disableChangeOrder?: boolean;
    renderContent: (props: T, idx: number, draggableProvided: DraggableProvided) => JSX.Element;
    onClickItem?: (item: T) => void;
    onMouseDownItem?: (item: T) => void;
    onDragEnd?: (result: DropResult, resultItems: T[]) => void;
}