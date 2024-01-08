import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import Map, { FullscreenControl, Marker, NavigationControl, ViewState } from 'react-map-gl/maplibre';

import { MpaViewProps, Position } from './map-view';

import 'maplibre-gl/dist/maplibre-gl.css';

const mapUrl = `https://api.maptiler.com/maps/${process.env.NEXT_PUBLIC_MAP_ID}/style.json?key=${process.env.NEXT_PUBLIC_MAP_KEY}`
const INIT_POSITION: Position = {
    longitude: 121.273,
    latitude: 23.529,
}
const INIT_VIEWSTATE: Partial<ViewState> = {
    longitude: 121.273,
    latitude: 23.529,
    zoom: 8,
    pitch: 50,
}

export default function MpaView({ hiddenCtrls, ctrlPosition }: MpaViewProps) {
    const [viewStateCtrl, setViewStateCtrl] = useState<Partial<ViewState>>(INIT_VIEWSTATE);
    const [location, setLocation] = useState<Position>(INIT_POSITION);
    const locationPin = useMemo(() => {
        return <Marker
            key={`marker-${'location'}`}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={e => {
                e.originalEvent.stopPropagation();
                setViewStateCtrl(pre => ({ ...pre, ...location, zoom: 15 }))
            }}
        >
            <>
                <FontAwesomeIcon
                    icon={faLocationDot}
                    className={`
                text-7xl text-nics-deep opacity-80
            `} />
            </>

            {/* <div>123123</div> */}
            {/* <span className={`
                pi pi-map-marker text-7xl 
                text-nics-deep text-shadow-center shadow-nics-light
                opacity-70
            `} /> */}
        </Marker>
    }, [location])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => {
                const { longitude, latitude } = p.coords
                setLocation({ longitude, latitude });
                setViewStateCtrl(pre => ({ ...pre, longitude, latitude }))
            });
        }
    }, []);


    return (
        <Map
            {...viewStateCtrl}
            onDrag={({ viewState }) => {
                setViewStateCtrl(viewState)
            }}
            onZoom={({ viewState }) => {
                setViewStateCtrl(viewState)
            }}
            onRotate={({ viewState }) => {
                setViewStateCtrl(viewState)
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
            {locationPin}
        </Map >
    )
}