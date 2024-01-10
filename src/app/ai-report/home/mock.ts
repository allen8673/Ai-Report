import { PositionInfo } from "@/components/map-view/map-view";

export interface MockData {
    type: '' | 'normal' | 'warning' | 'danger';
    riskDescription?: string

}
export const mockdata: PositionInfo<MockData>[] = [
    {
        name: 'National Museum of Natural Science',
        position: {
            longitude: 120.924778,
            latitude: 24.216129,
        },
        data: {
            type: 'normal',
            riskDescription: 'The security protection system is operating normally.'
        }
    },
    {
        name: 'National Science and Technology Museum',
        position: {
            longitude: 120.3222442,
            latitude: 22.6408282,
        },
        data: {
            type: 'normal',
            riskDescription: 'The security protection system is operating normally.'
        }
    },
    {
        name: 'National Palace Museum',
        position: {
            longitude: 121.548663,
            latitude: 25.101992,
        },
        data: {
            type: 'warning',
            riskDescription: 'Vulnerabilities in the security protection system were discovered.'

        }
    },
    {
        name: 'National Center for Traditional Arts',
        position: {
            longitude: 121.825276,
            latitude: 24.686011,
        },
        data: {
            type: 'danger',
            riskDescription: 'The security protection system is under attacking.'
        }
    }
]