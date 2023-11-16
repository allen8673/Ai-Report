import { IconDefinition, faUpload, faDownload, faBrain } from '@fortawesome/free-solid-svg-icons'
import { Edge } from 'reactflow';

import { IFlowBase } from '@/interface/workflow';

export const EDGE_DEF_SETTING: Partial<Edge> = {
    type: 'turbo',
    animated: true,
    style: { strokeWidth: 3 }
}

export const REPORT_ITEMS: IFlowBase[] = [
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
    }
} = {
    'file-upload': { icon: faUpload, },
    'prompt': { icon: faBrain, },
    'file-download': { icon: faDownload, }
}