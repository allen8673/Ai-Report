import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import { useMemo, useState } from 'react';
import Map, { FullscreenControl, Marker, NavigationControl, ViewState } from 'react-map-gl/maplibre';

import { MpaViewProps, Position } from './map-view';

import 'maplibre-gl/dist/maplibre-gl.css';

const mapUrl = `https://api.maptiler.com/maps/${process.env.NEXT_PUBLIC_MAP_ID}/style.json?key=${process.env.NEXT_PUBLIC_MAP_KEY}`
const INIT_VIEWSTATE: Partial<ViewState> = {
    longitude: 121.15334218362636,
    latitude: 23.117270960253094,
    zoom: 8.832856,
    pitch: 50,
    bearing: -20
}
const ACCURACY = 0.1;
const FPS = 180

export default function MpaView<T>(props: MpaViewProps<T>) {
    const { hiddenCtrls, ctrlPosition, positions, renderPin } = props;
    const [viewState, setViewState] = useState<Partial<ViewState>>(INIT_VIEWSTATE);
    const locationPins = useMemo(() => {
        return map(positions, position => {
            const { position: location, key = '' } = position;
            const { onClick, onMouseEnter, onMouseLeave, render } = renderPin || {};
            return (
                <Marker
                    key={`marker-${key}`}
                    longitude={location.longitude}
                    latitude={location.latitude}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        onClick?.({ position, setViewState, zoomTo })
                    }}
                >
                    <span
                        onMouseEnter={() => {
                            onMouseEnter?.({ position, setViewState, zoomTo });
                        }}
                        onMouseLeave={() => {
                            onMouseLeave?.({ position, setViewState, zoomTo })
                        }}
                    >
                        {(typeof render === 'function' ? render(position) : render) ||
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className={`text-7xl text-nics-deep opacity-80 cursor-pointer`}
                            />
                        }
                    </span>
                </Marker>
            );
        })
    }, [positions]);

    const positionAnimation = async (position: Position, frames: number) => {
        const { longitude, latitude } = position;
        let currentlon = viewState.longitude || 0;
        let currentlat = viewState.latitude || 0;
        const lonIsDecreasing = currentlon > longitude;
        const latIsDecreasing = currentlat > latitude;
        const lon_move_gap = Math.abs(currentlon - longitude) / frames;
        const lat_move_gap = Math.abs(currentlat - latitude) / frames;

        let _ctrl = 0
        while (_ctrl < frames) {
            lonIsDecreasing ? (currentlon -= lon_move_gap) : (currentlon += lon_move_gap);
            latIsDecreasing ? (currentlat -= lat_move_gap) : (currentlat += lat_move_gap);
            setViewState(pre => ({ ...pre, longitude: currentlon, latitude: currentlat }));
            _ctrl++;
            await new Promise(resolve => setTimeout(resolve, (1 / FPS) * 1000));
        }
        setViewState(pre => ({ ...pre, longitude, latitude }))
    }

    const zoomAnimation = async (zoom: number, frames: number) => {
        let currentZoom = viewState.zoom || 0;
        const zoomIsDecreasing = currentZoom > zoom;
        const zoom_move_gap = Math.abs(currentZoom - zoom) / frames;
        let _ctrl = 0
        while (_ctrl < frames) {
            zoomIsDecreasing ? (currentZoom -= zoom_move_gap) : (currentZoom += zoom_move_gap);
            setViewState(pre => ({ ...pre, zoom: currentZoom }));
            _ctrl++
            await new Promise(resolve => setTimeout(resolve, (1 / FPS) * 1000));
        }
        setViewState(pre => ({ ...pre, zoom }))
    }

    const zoomTo = async (position: Position, zoom: number) => {
        const frames = Math.abs((viewState.zoom || 0) - zoom) / ACCURACY;
        await positionAnimation(position, frames);
        await zoomAnimation(zoom, frames);
    }

    return (
        <Map
            {...viewState}
            onDrag={({ viewState }) => {
                setViewState(viewState)
            }}
            onZoom={({ viewState }) => {
                setViewState(viewState)
            }}
            onRotate={({ viewState }) => {
                setViewState(viewState)
            }}
            mapStyle={mapUrl}
        >
            {!hiddenCtrls && (
                <>
                    {/* <GeolocateControl position={ctrlPosition} /> */}
                    <FullscreenControl position={ctrlPosition} />
                    <NavigationControl position={ctrlPosition} />
                </>
            )}
            {locationPins}
        </Map >
    )
}