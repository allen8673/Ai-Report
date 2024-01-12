import { PositionInfo } from "@/components/map-view/map-view";

export interface MockData {
    type: '' | 'normal' | 'warning' | 'danger';
    riskDescription?: string

}
export const mockdata: PositionInfo<MockData>[] = [
    {
        name: 'National Museum of Natural Science',
        key: 'NMNS',
        position: {
            longitude: 120.6655278,
            latitude: 24.1573179,
        },
        data: {
            type: 'normal',
            riskDescription: 'The security protection system is operating normally.'
        }
    },
    {
        name: 'National Science and Technology Museum',
        key: 'NSTM',
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
        key: 'NPM',
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
        key: 'NCTA',
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