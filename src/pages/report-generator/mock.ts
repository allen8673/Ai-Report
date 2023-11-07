import { Node, Edge } from "reactflow";

import { IReportItem } from "./type";

export const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Node 1' },
        position: { x: 250, y: 5 },
    },
    {
        id: '2',
        data: { label: 'Node 2' },
        position: { x: 100, y: 100 },
    },
    {
        id: '3',
        data: { label: 'Node 3' },
        position: { x: 400, y: 100 },
    },
    {
        id: '4',
        data: { label: 'Node 4' },
        position: { x: 400, y: 200 },
        type: 'custom',
    },
];

export const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
];

export const reportItems: IReportItem[] = [{
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