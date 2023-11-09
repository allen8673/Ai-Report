import { faBook, faFile, faFolder, IconDefinition } from '@fortawesome/free-solid-svg-icons'


export const iconMap: {
    [type: string]: {
        icon: IconDefinition;
        color: string;
    }
} = {
    'type-1': { color: '#517ECB', icon: faBook, },
    'type-2': { color: '#51CBB3', icon: faFile, },
    'type-3': { color: '#CBC751', icon: faFolder, }
}