import { IconDefinition, faUpload, faDownload, faBrain, faCloud, faComment, faCloudDownload, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { Edge, MarkerType } from 'reactflow';

import { FlowTyep, IFlowNodeBase } from '@/interface/workflow';

export const EDGE_DEF_SETTING: Partial<Edge> = {
    // type: 'smoothstep',
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2a8af6' },
    interactionWidth: 20,
}

export const REPORT_ITEMS: IFlowNodeBase[] = [
    {
        id: 'custom-prompt',
        name: 'Custom Prompt',
        type: 'Normal'
    },
    {
        id: 'workflow',
        name: 'Workflow',
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
    [type in FlowTyep]: {
        nodeType: '' | 'start' | 'end';
        nodeName?: string;
        icon: IconDefinition;
        actIcon?: IconInfo;
        editIcon?: IconInfo;
    }
} = {
    'Input': {
        nodeType: 'start',
        icon: faUpload,
        nodeName: 'Upload',
        // actIcon: {
        //     icon: faCloudUpload,
        //     label: 'the files has uploaded.'
        // },
        // editIcon: {
        //     icon: faFileArrowUp,
        //     label: 'upload your files.',
        //     interactable: true
        // }
    },
    'Normal': {
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
    'Workflow': {
        nodeType: '',
        icon: faShareNodes,
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
    'Output': {
        nodeType: 'end',
        nodeName: 'Done',
        icon: faDownload,
        actIcon: {
            icon: faCloudDownload,
            label: 'there are filed can be download',
            interactable: true
        },
    }
}