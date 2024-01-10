'use client'
import { IconDefinition, faCircleExclamation, faShield, faShieldVirus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { concat } from "lodash";
import { useEffect, useState } from "react";

import { MockData, mockdata } from "./mock";

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

function LocationPane(pinData: PositionInfo<MockData>) {
    const { data } = pinData
    let textColor = '';
    switch (data?.type) {
        case 'warning':
            textColor = 'text-warning';
            break;
        case 'danger':
            textColor = 'text-failure';
            break;
    }
    const className = `text-xl font-bold ${textColor}`;
    return (<div className="text-turbo-deep-strong">
        <h1 className="">{pinData.name}</h1>
        <i className="m-0 text-turbo-deep-weak"><b> {pinData.position.latitude}, {pinData.position.longitude}</b></i>
        {!!data && <p className={className}>
            {data.riskDescription}
        </p>}
    </div>)
}

export default function Home() {

    const { setBgMainview } = useLayoutContext();
    const [locationInfo, setLocationInfo] = useState<PositionInfo<MockData>>({ name: 'You are here', position: INIT_POSITION });
    const [pinData, setPinData] = useState<PositionInfo>();

    useEffect(() => {
        setBgMainview(true);
        return () => setBgMainview(false)
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => {
                const { longitude, latitude } = p.coords
                setLocationInfo(pre => ({ ...pre, position: { longitude, latitude } }));
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
                positions={concat(mockdata, locationInfo)}
                renderPin={{
                    render: (position) => {
                        if (!position.data?.type) return undefined
                        let icon: IconDefinition;
                        let textColor;
                        switch (position.data.type) {
                            default:
                            case 'normal':
                                icon = faShield;
                                textColor = 'text-success';
                                break;
                            case 'warning':
                                icon = faCircleExclamation;
                                textColor = 'text-warning';
                                break;
                            case 'danger':
                                icon = faShieldVirus;
                                textColor = 'text-failure';
                                break;
                        }
                        const className = `text-5xl ${textColor} opacity-90 cursor-pointer`

                        return <FontAwesomeIcon
                            icon={icon}
                            className={className}
                        />
                    },
                    onClick: ({ position, zoomTo }) => {
                        zoomTo(position.position, 15)
                    },
                    onMouseEnter: ({ position }) => {
                        setPinData(position)
                    },
                    onMouseLeave: () => {
                        setPinData(undefined)
                    },
                }}
                ctrlPosition='bottom-right'
            />
        </div>
    )
}
