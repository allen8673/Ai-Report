
import { IFlow, IWorkflow } from "@/interface/workflow";

export const mock_flows: IFlow[] = [
    {
        id: 'f-1',
        name: 'upload stix',
        type: 'file-upload',
        position: { x: 100, y: 200 },
        forwards: ['f-2', 'f-4']
    },
    {
        id: 'f-2',
        name: 'analysis ip',
        type: 'prompt',
        position: { x: 600, y: 300 },
        forwards: ['f-5']

    },
    {
        id: 'f-4',
        name: 'analysis add.',
        type: 'prompt',
        position: { x: 600, y: 100 },
        forwards: ['f-5']
    },
    {
        id: 'f-5',
        name: 'Done',
        type: 'file-download',
        position: { x: 1100, y: 200 },
    }

]



export const mock_projects: IWorkflow[] = [
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