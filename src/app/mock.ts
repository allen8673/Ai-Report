import { Node, Edge } from "reactflow";

import { IFlow, IProject } from "@/interface/project";

export const initialNodes: Node<IFlow>[] = [
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


export const mock_projects: IProject[] = [
    {
        id: 'p-1',
        name: 'project 1',
        flows: []
    },
    {
        id: 'p-2',
        name: 'project 2',
        flows: []
    }
]