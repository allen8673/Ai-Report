import { ControlPosition, } from 'react-map-gl/maplibre';

export interface MpaViewProps {
    hiddenCtrls?: boolean;
    ctrlPosition?: ControlPosition;
}
export interface Position {
    longitude: number;
    latitude: number;
}