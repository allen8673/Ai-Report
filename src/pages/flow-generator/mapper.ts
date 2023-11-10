import { IconDefinition, faUpload, faDownload, faBrain } from '@fortawesome/free-solid-svg-icons'



export const flowInfoMap: {
    [type: string]: {
        icon: IconDefinition;
        color: string;
    }
} = {
    'file-upload': { color: '#517ECB', icon: faUpload, },
    'prompt': { color: '#51CBB3', icon: faBrain, },
    'file-download': { color: '#CBC751', icon: faDownload, }
}