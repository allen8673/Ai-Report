import { Node, Edge } from "reactflow";

import { IReportItem } from "./type";

export const initialNodes: Node<IReportItem>[] = [
    {
        id: '1',
        type: 'middle',
        data: {
            id: 'r-1',
            name: 'report 1',
            type: 'type-1'
        },
        position: { x: 100, y: 100 },
    },
    {
        id: '2',
        data: {
            id: 'r-2',
            name: 'report 2',
            type: 'type-2'
        },
        position: { x: 600, y: 300 },

    },
    {
        id: '3',
        data: {
            id: 'r-4',
            name: 'report 4',
            type: 'type-2'
        },
        position: { x: 600, y: 0 },
    },

];

export const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
];

export const reportItems: IReportItem[] = [
    {
        id: 'r-1',
        name: 'report 1',
        type: 'type-1'
    },
    {
        id: 'r-2',
        name: 'report 2',
        type: 'type-2'
    },
    {
        id: 'r-3',
        name: 'report 3',
        type: 'type-3'
    },
    {
        id: 'r-4',
        name: 'report 4',
        type: 'type-2'
    }
]