import { faBook, faFile, faFolder, IconDefinition } from '@fortawesome/free-solid-svg-icons'


export const iconMap: {
    [type: string]: {
        icon: IconDefinition;
        color: string;
        bgColor: string;
    }
} = {
    'type-1': { color: '#517ECB', icon: faBook, bgColor: 'bg-[#517ECB]' },
    'type-2': { color: '#51CBB3', icon: faFile, bgColor: 'bg-[#51CBB3]' },
    'type-3': { color: '#CBC751', icon: faFolder, bgColor: 'bg-[#CBC751]' }
}