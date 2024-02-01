import { filter } from 'lodash';
import { Edge, MarkerType } from 'reactflow';


import { FlowGraphProps } from './type';

import { FlowType, IReportCompData } from '@/interface/flow';

export const EDGE_DEF_SETTING: Partial<Edge> = {
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2a8af6' },
    interactionWidth: 20,
}

export const GET_REPORT_COMPONENTS = ({ flowNameMapper }: FlowGraphProps): IReportCompData[] => {

    const items: IReportCompData[] = [
        {
            id: 'custom-prompt',
            name: 'Custom Prompt',
            comp_type: 'Normal'
        },
        {
            id: 'workflow',
            name: 'Workflow',
            comp_type: 'Workflow'
        },
        {
            id: 'report',
            name: 'Report',
            comp_type: 'Report'
        }
    ]

    const disableItms: { [key in FlowType]?: boolean } = {
        'Workflow': !flowNameMapper
    }

    return filter(items, i => !disableItms[i.comp_type])
}


export const flowInfoMap: {
    [type in FlowType]: {
        nodeType: '' | 'start' | 'end';
        nodeName?: string;
        icon: string;
        editable?: boolean
    }
} = {
    'Input': {
        nodeType: 'start',
        icon: 'pi-upload',
        nodeName: 'Upload',
    },
    'Output': {
        nodeType: 'end',
        nodeName: 'Done',
        icon: 'pi-download',
    },
    'Normal': {
        nodeType: '',
        icon: 'pi-comment',
        editable: true
    },
    'Workflow': {
        nodeType: '',
        icon: 'pi-share-alt',
        editable: true
    },

    'Report': {
        nodeType: '',
        icon: 'pi-file',
        editable: true
    }
}