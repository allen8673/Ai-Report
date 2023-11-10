import { Node, Edge } from "reactflow";

import { IReportItem } from "../pages/flow-editor/type";

export const initialNodes: Node<IReportItem>[] = [
    {
        id: '1',
        data: {
            id: 'f-1',
            name: 'upload stix',
            type: 'file-upload'
        },
        position: { x: 100, y: 200 },
    },
    {
        id: '2',
        data: {
            id: 'f-2',
            name: 'analysis ip',
            type: 'prompt'
        },
        position: { x: 600, y: 300 },

    },
    {
        id: '3',
        data: {
            id: 'f-4',
            name: 'analysis add.',
            type: 'prompt'
        },
        position: { x: 600, y: 100 },
    },
    {
        id: '4',
        data: {
            id: 'f-5',
            name: 'Done',
            type: 'file-download'
        },
        position: { x: 1100, y: 200 },
    },

];

export const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
];

export const reportItems: IReportItem[] = [
    {
        id: 'r-1',
        name: 'Custom Promt',
        type: 'prompt'
    },
    {
        id: 'r-2',
        name: 'File Upload',
        type: 'file-upload'
    },
    {
        id: 'r-3',
        name: 'File Download',
        type: 'file-download'
    },
]