import { useEffect, useState } from 'react';
import Map, { ViewState } from 'react-map-gl/maplibre';

const mapUrl = `https://api.maptiler.com/maps/5c9946fa-9bed-4f8a-bd7b-3bc10ec13d5d/style.json?key=${process.env.NEXT_PUBLIC_MAP_KEY}`
const initialViewState: Partial<ViewState> = {
    zoom: 15,
    pitch: 60,
}

export default function MpaView() {
    const [location, setLocation] = useState<{ longitude: number; latitude: number; }>(
        {
            longitude: 121.273,
            latitude: 23.529,
        }
    )

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => {
                const { longitude, latitude } = p.coords
                setLocation({ longitude, latitude })
            });
        }
    }, [])

    return (
        <Map
            initialViewState={initialViewState}
            {...location}
            onDrag={({ viewState }) => {
                const { latitude, longitude } = viewState
                setLocation({ latitude, longitude })
            }}
            mapStyle={mapUrl}
        />
    )
}