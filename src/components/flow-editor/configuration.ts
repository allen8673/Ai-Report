import { IconDefinition, faUpload, faDownload, faBrain, faCloudUpload, faCloud, faFileArrowUp, faComment, faCloudDownload } from '@fortawesome/free-solid-svg-icons'
import { Edge, MarkerType } from 'reactflow';

import { IFlowBase } from '@/interface/workflow';

export const EDGE_DEF_SETTING: Partial<Edge> = {
    // type: 'smoothstep',
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

export interface IconInfo {
    icon: IconDefinition;
    label?: string;
    interactable?: boolean;
}

export const flowInfoMap: {
    [type: string]: {
        icon: IconDefinition;
        actIcon?: IconInfo,
        editIcon?: IconInfo
    }
} = {
    'file-upload': {
        icon: faUpload,
        actIcon: {
            icon: faCloudUpload,
            label: 'the file has uploaded.'
        },
        editIcon: {
            icon: faFileArrowUp,
            label: 'upload your files.',
            interactable: true
        }
    },
    'prompt': {
        icon: faBrain,
        actIcon: {
            icon: faCloud,
            label: 'the promt is setted.'
        },
        editIcon: {
            icon: faComment,
            label: 'set the prompt.',
            interactable: true
        }
    },
    'file-download': {
        icon: faDownload,
        actIcon: {
            icon: faCloudDownload,
            label: 'there are filed can be download',
            interactable: true
        },
    }
}