'use client'
import { useEffect, useState } from "react";
import Map from 'react-map-gl/maplibre';

import { useLayoutContext } from "@/layout/standard-layout/context";

const mapUrl = `https://api.maptiler.com/maps/5c9946fa-9bed-4f8a-bd7b-3bc10ec13d5d/style.json?key=${process.env.NEXT_PUBLIC_MAP_KEY}`

export default function Home() {

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

    const { setBgMainview } = useLayoutContext()
    useEffect(() => {
        setBgMainview(true);
        return () => setBgMainview(false)
    }, []);

    return (
        <div className="flex-center w-full h-full text-light overflow-hidden" >
            <div className={`
            absolute top-[20px] right-[20px]
            p-7 bg-deep/[.8] z-2
            flex-center flex-col gap-[15px]
            rounded-std border-light-weak border-solid border-[3px]`}>
                <h1 className={`text-5xl text-turbo-deep-strong text-shadow-center shadow-turbo-deep`}>
                    Welcome to AI Report
                </h1>
            </div>
            <Map
                initialViewState={{
                    zoom: 15,
                    pitch: 60,
                    bearing: -10
                }}
                {...location}
                onDrag={({ viewState }) => {
                    const { latitude, longitude } = viewState
                    setLocation({ latitude, longitude })
                }}
                mapStyle={mapUrl}
            />
            {/* <MatrixAnimationPanel
                text="NATIONAL INSTITUTE FOR CYBER SECURITY "
                randomPermutaion={false} 
                fontColor="#95679e" /> */}
        </div>
    )
}
