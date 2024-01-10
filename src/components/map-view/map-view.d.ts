import { ReactNode, Dispatch, SetStateAction } from 'react';
import { ControlPosition, ViewState } from 'react-map-gl/maplibre';


export interface MpaViewProps<T> {
    hiddenCtrls?: boolean;
    ctrlPosition?: ControlPosition;
    positions: PositionInfo<T>[];
    renderPin?: RenderPin<T>;
}

type SetViewState = Dispatch<SetStateAction<Partial<ViewState>>>;
export type PinAct<T = void> = (props: {
    position: PositionInfo;
    setViewState: SetViewState;
    zoomTo: (position: Position, zoom: number) => void
}) => T
export interface RenderPin<T> {
    render?: ReactNode | ((position: PositionInfo<T>) => ReactNode);
    onClick?: PinAct;
    onMouseEnter?: PinAct;
    onMouseLeave?: PinAct;
}

export interface PositionInfo<T = any> {
    key?: string;
    name?: string;
    position: Position;
    data?: T;
}

export interface Position {
    longitude: number;
    latitude: number;
}