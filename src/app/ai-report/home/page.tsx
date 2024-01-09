'use client'
import { useEffect, useState } from "react";

import MpaView from "@/components/map-view";
import { Position, PositionInfo } from "@/components/map-view/map-view";
import { useLayoutContext } from "@/layout/standard-layout/context";

const INIT_POSITION: Position = {
    longitude: 121.273,
    latitude: 23.529,
}

function DefaultContent() {
    return (
        <h1 className={`text-5xl text-turbo-deep-strong text-shadow-center shadow-turbo-deep`}>
            Welcome to AI Report
        </h1>)
}

function LocationPane(pinData: PositionInfo) {
    return (<div className="text-turbo-deep-strong">
        <h1 className="">You are here</h1>
        <h3><b>latitude:</b> {pinData.position.latitude}</h3>
        <h3><b>longitude:</b> {pinData.position.longitude}</h3>
    </div>)
}

export default function Home() {

    const { setBgMainview } = useLayoutContext();
    const [location, setLocation] = useState<Position>(INIT_POSITION);
    const [pinData, setPinData] = useState<PositionInfo>();

    useEffect(() => {
        setBgMainview(true);
        return () => setBgMainview(false)
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => {
                const { longitude, latitude } = p.coords
                setLocation({ longitude, latitude });
            });
        }
    }, []);

    return (
        <div className="flex-center w-full h-full text-light" >
            <div className={`
            absolute top-[20px] right-[20px]
            p-7 bg-deep/[.8] z-2
            flex-center flex-col gap-[15px]
            rounded-std border-light-weak border-solid border-[3px]`}>
                {(!!pinData ? <LocationPane {...pinData} /> : <DefaultContent />)}
            </div>
            <MpaView
                positions={[{ key: 'location', position: location }]}
                renderPin={{
                    onClick: ({ position, setViewState }) => {
                        setViewState(pre => ({ ...pre, ...position.position, zoom: 20 }));
                    },
                    onMouseEnter: ({ position }) => {
                        setPinData(position)
                    },
                    onMouseLeave: () => {
                        setPinData(undefined)
                    }
                }}
                ctrlPosition='bottom-right'
            />
        </div>
    )
}
