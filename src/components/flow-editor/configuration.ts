import { IconDefinition, faUpload, faDownload, faBrain, faShareNodes, faFileLines } from '@fortawesome/free-solid-svg-icons'
import { Edge, MarkerType } from 'reactflow';

import { FlowTyep, IFlowNodeBase } from '@/interface/flow';

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
    {
        id: 'report',
        name: 'Report',
        type: 'Report'
    }
]


export const flowInfoMap: {
    [type in FlowTyep]: {
        nodeType: '' | 'start' | 'end';
        nodeName?: string;
        icon: IconDefinition;
        editable?: boolean
    }
} = {
    'Input': {
        nodeType: 'start',
        icon: faUpload,
        nodeName: 'Upload',
    },
    'Output': {
        nodeType: 'end',
        nodeName: 'Done',
        icon: faDownload,
    },
    'Normal': {
        nodeType: '',
        icon: faBrain,
        editable: true
    },
    'Workflow': {
        nodeType: '',
        icon: faShareNodes,
        editable: true
    },

    'Report': {
        nodeType: '',
        icon: faFileLines,
        editable: true
    }
}