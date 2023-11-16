import { IconDefinition, faUpload, faDownload, faBrain, faCloudUpload } from '@fortawesome/free-solid-svg-icons'
import { Edge, MarkerType } from 'reactflow';

import { IFlowBase } from '@/interface/workflow';

export const EDGE_DEF_SETTING: Partial<Edge> = {
    type: 'turbo',
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2a8af6' },
    interactionWidth: 20,
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
        actIcon?: IconDefinition,
        editIcon?: IconDefinition
    }
} = {
    'file-upload': { icon: faUpload, actIcon: faCloudUpload },
    'prompt': { icon: faBrain, },
    'file-download': { icon: faDownload, }
}