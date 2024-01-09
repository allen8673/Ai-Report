import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import { useMemo, useState } from 'react';
import Map, { FullscreenControl, Marker, NavigationControl, ViewState } from 'react-map-gl/maplibre';

import { MpaViewProps } from './map-view';

import 'maplibre-gl/dist/maplibre-gl.css';

const mapUrl = `https://api.maptiler.com/maps/${process.env.NEXT_PUBLIC_MAP_ID}/style.json?key=${process.env.NEXT_PUBLIC_MAP_KEY}`
const INIT_VIEWSTATE: Partial<ViewState> = {
    longitude: 121.15334218362636,
    latitude: 23.117270960253094,
    zoom: 8.832856,
    pitch: 50,
    bearing: -20
}

export default function MpaView(props: MpaViewProps) {
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
                        onClick?.({ position, setViewState })
                        // setViewStateCtrl(pre => ({ ...pre, ...location, zoom: 15 }))
                    }}
                >
                    <span
                        onMouseEnter={() => {
                            onMouseEnter?.({ position, setViewState });
                        }}
                        onMouseLeave={() => {
                            onMouseLeave?.({ position, setViewState })
                        }}
                    >
                        {typeof render === 'function' ?
                            render(position) :
                            (render || <FontAwesomeIcon
                                icon={faLocationDot}
                                className={`text-7xl text-nics-deep opacity-80 cursor-pointer`}
                            />)
                        }
                    </span>
                </Marker>
            );
        })
    }, [positions]);


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