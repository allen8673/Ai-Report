'use client'
import { IconDefinition, faCircleExclamation, faShield, faShieldVirus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { concat } from "lodash";
import { useEffect, useState } from "react";

import { MockData, mockdata } from "./mock";

import MpaView from "@/components/map-view";
import { PositionInfo } from "@/components/map-view/map-view";
import { useBackgroundMainview } from "@/layout/standard-layout/lib";

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

    const [locationInfo, setLocationInfo] = useState<PositionInfo<MockData>>();
    const [pinData, setPinData] = useState<PositionInfo>();

    useBackgroundMainview();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => {
                const { longitude, latitude } = p.coords
                setLocationInfo(() => ({ name: 'You are here', key: 'YRH', position: { longitude, latitude } }));
            });
        }
    }, []);

    return (
        <div className="flex-center w-full h-full text-light" >
            <div className={`
            absolute top-[20px] right-[20px] w-[560px]
            p-7 bg-deep/[.8] z-2
            flex-center flex-col gap-[15px]
            rounded-std shadow-[0px_0px_15px_-3px] shadow-light-weak`}>
                {(!!pinData ? <LocationPane {...pinData} /> : <DefaultContent />)}
            </div>
            <MpaView
                positions={!!locationInfo ? concat(mockdata, locationInfo) : mockdata}
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
