import { IconDefinition, faUpload, faDownload, faBrain, faCloudUpload, faCloud, faFileArrowUp, faComment, faCloudDownload, faShapes } from '@fortawesome/free-solid-svg-icons'
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
        id: 'custom-prompt',
        name: 'Custom Prompt',
        type: 'Normal'
    },
    {
        id: 'workflow',
        name: 'Template',
        type: 'Workflow'
    },
    // {
    //     id: 'file-upload',
    //     name: 'Upload',
    //     type: 'file-upload'
    // },
    // {
    //     id: 'file-download',
    //     name: 'Done',
    //     type: 'file-download'
    // },
]

export interface IconInfo {
    icon: IconDefinition;
    label?: string;
    interactable?: boolean;
}

export const flowInfoMap: {
    [type: string]: {
        nodeType: '' | 'start' | 'end',
        icon: IconDefinition;
        actIcon?: IconInfo,
        editIcon?: IconInfo
    }
} = {
    'file-upload': {
        nodeType: 'start',
        icon: faUpload,
        actIcon: {
            icon: faCloudUpload,
            label: 'the files has uploaded.'
        },
        editIcon: {
            icon: faFileArrowUp,
            label: 'upload your files.',
            interactable: true
        }
    },
    'prompt': {
        nodeType: '',
        icon: faBrain,
        actIcon: {
            icon: faCloud,
            label: 'the prompt is set up.'
        },
        editIcon: {
            icon: faComment,
            label: 'set the prompt.',
            interactable: true
        }
    },
    'template': {
        nodeType: '',
        icon: faShapes,
        actIcon: {
            icon: faCloud,
            label: 'the prompt is set up.'
        },
        editIcon: {
            icon: faComment,
            label: 'set the prompt.',
            interactable: true
        }
    },
    'file-download': {
        nodeType: 'end',
        icon: faDownload,
        actIcon: {
            icon: faCloudDownload,
            label: 'there are filed can be download',
            interactable: true
        },
    }
}