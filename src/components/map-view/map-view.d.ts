import { ReactNode, Dispatch, SetStateAction } from 'react';
import { ControlPosition, ViewState } from 'react-map-gl/maplibre';


export interface MpaViewProps {
    hiddenCtrls?: boolean;
    ctrlPosition?: ControlPosition;
    positions: PositionInfo[];
    renderPin?: RenderPin;
}

type SetViewState = Dispatch<SetStateAction<Partial<ViewState>>>;
export type PinAct<T = void> = (props: {
    position: PositionInfo;
    setViewState: SetViewState;
}) => T
export interface RenderPin {
    render?: ReactNode | ((position: PositionInfo) => ReactNode);
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