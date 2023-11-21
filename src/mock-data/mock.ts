
import { ITemplate, IWorkflow } from "@/interface/workflow";


export const mock_workflows: IWorkflow[] = [
    {
        "id": "wf-3",
        "name": "demo workflow",
        "rootNdeId": "e7bce421-054c-45f6-b663-c8816f75df67",
        "flows": [
            {
                "id": "e7bce421-054c-45f6-b663-c8816f75df67",
                "name": "Upload",
                "type": "file-upload",
                "position": {
                    "x": -80,
                    "y": 430
                },
                "forwards": [
                    "dec48f6e-6d86-406d-ad8b-53d3a4efbb48"
                ]
            },
            {
                "id": "7e61d0cb-999e-483e-8b8b-955d0fc4024d",
                "name": "analyze the risks",
                "type": "prompt",
                "position": {
                    "x": 1140,
                    "y": 620
                },
                "forwards": [
                    "713a3ea2-3e9d-4c4c-9829-8b3d87165e4f"
                ],
                "prompt": "hi AI, can you tell me what the risks we are facing?"
            },
            {
                "id": "02074628-240b-4bf8-ac8b-0a207154da1f",
                "name": "analyze id",
                "type": "prompt",
                "position": {
                    "x": 1140,
                    "y": 280
                },
                "forwards": [
                    "713a3ea2-3e9d-4c4c-9829-8b3d87165e4f"
                ],
                "prompt": "hi AI, plz analyze the id for me."
            },
            {
                "id": "99331e93-0673-4d80-ae49-5e38e5638637",
                "name": "list events",
                "type": "prompt",
                "position": {
                    "x": 680,
                    "y": 620
                },
                "forwards": [
                    "7e61d0cb-999e-483e-8b8b-955d0fc4024d"
                ],
                "prompt": "Hi Al, list all attack events."
            },
            {
                "id": "cbff8f60-a777-47a2-88f7-ce516779adac",
                "name": "give me some suggestions.",
                "type": "prompt",
                "position": {
                    "x": 680,
                    "y": 280
                },
                "forwards": [
                    "02074628-240b-4bf8-ac8b-0a207154da1f"
                ],
                "prompt": "Hi AI, plz give me some suggestions regarding the security defense we can do.  "
            },
            {
                "id": "dec48f6e-6d86-406d-ad8b-53d3a4efbb48",
                "name": "roughly analyze the file ",
                "type": "prompt",
                "position": {
                    "x": 280,
                    "y": 430
                },
                "forwards": [
                    "cbff8f60-a777-47a2-88f7-ce516779adac",
                    "99331e93-0673-4d80-ae49-5e38e5638637"
                ],
                "prompt": "Hi AI, plz analyze the uploaded file, and give me some useful data. "
            },
            {
                "id": "713a3ea2-3e9d-4c4c-9829-8b3d87165e4f",
                "name": "Done",
                "type": "file-download",
                "position": {
                    "x": 1630,
                    "y": 450
                },
                "forwards": []
            },
        ]
    },
    {
        id: 'p-1',
        name: 'project 1',
        rootNdeId: 'f-1',
        flows: [
            {
                id: 'f-1',
                name: 'Upload',
                type: 'file-upload',
                position: { x: 100, y: 400 },
                forwards: ['f-2', 'f-4'],
            },
            {
                id: 'f-2',
                name: 'analysis ip',
                type: 'prompt',
                position: { x: 600, y: 500 },
                forwards: ['f-5']

            },
            {
                id: 'f-4',
                name: 'analysis add.',
                type: 'prompt',
                position: { x: 600, y: 300 },
                forwards: ['f-5']
            },
            {
                id: 'f-5',
                name: 'Done',
                type: 'file-download',
                position: { x: 1100, y: 400 },
            }]
    },
    {
        id: 'p-2',
        name: 'project 2',
        rootNdeId: 'f-1',
        flows: []
    },
]

export const mock_template: ITemplate[] = [
    {
        id: 'temp-1',
        name: 'Template 1',
        flows: []
    }
]