import { IconDefinition, faUpload, faDownload, faBrain } from '@fortawesome/free-solid-svg-icons'

import { IReportItem } from './type';


export const REPORT_ITEMS: IReportItem[] = [
    {
        id: 'custom-promt',
        name: 'Custom Promt',
        type: 'prompt'
    },
    {
        id: 'file-upload',
        name: 'File Upload',
        type: 'file-upload'
    },
    {
        id: 'file-download',
        name: 'File Download',
        type: 'file-download'
    },
]


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