
import { ITemplate, IWorkflow } from "@/interface/workflow";


export const mock_workflows: IWorkflow[] = [
    {
        "id": "d521066f-7f61-4be0-a9b9-a4517edfc825",
        "name": "demo workflow",
        "rootNdeId": ["e7bce421-054c-45f6-b663-c8816f75df67"],
        "flows": [
            {
                "id": "e7bce421-054c-45f6-b663-c8816f75df67",
                "name": "Upload",
                "type": 'Input',
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
                "type": 'Normal',
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
                "type": 'Normal',
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
                "type": 'Normal',
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
                "type": 'Normal',
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
                "type": 'Normal',
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
                "type": 'Output',
                "position": {
                    "x": 1630,
                    "y": 450
                },
                "forwards": []
            },
        ]
    },
]

export const mock_templates: ITemplate[] = [
    {
        id: 'dde9c1d8-15eb-45b1-9cc5-f5c8a12df64d',
        name: 'Base Template',
        "rootNdeId": ["52273db9-9caa-484c-947e-878d570bbfbe"],
        "flows": [
            {
                "id": "fafc2d39-2abf-4d47-994d-013b5151ad4c",
                "name": "Done",
                "type": 'Output',
                "position": {
                    "x": 800,
                    "y": 0
                },
                "forwards": []
            },
            {
                "id": "97f3de08-4f1b-45a5-a549-38e57e376483",
                "name": "your prompt",
                "type": 'Normal',
                "position": {
                    "x": 400,
                    "y": 0
                },
                "forwards": [
                    "fafc2d39-2abf-4d47-994d-013b5151ad4c"
                ],
                "prompt": "Hi AI, {PLZ INPUT YOUR PROMT}, then give me an analysis result!"
            },
            {
                "id": "52273db9-9caa-484c-947e-878d570bbfbe",
                "name": "Upload",
                "type": 'Input',
                "position": {
                    "x": 0,
                    "y": 0
                },
                "forwards": [
                    "97f3de08-4f1b-45a5-a549-38e57e376483"
                ]
            }
        ],
    },
    {
        id: '067d661d-125f-41bf-853f-11b373b2e4be',
        name: 'Analyze Attack Events ',
        "rootNdeId": ["6dc25c53-7615-47f5-a3f8-9c25b565e915"],
        flows: [
            {
                "id": "336ba94b-9315-40c3-a9fa-5cf668d50182",
                "name": "defense advice",
                "type": 'Normal',
                "position": {
                    "x": 1200,
                    "y": 0
                },
                "forwards": [
                    "72f17e4e-7e55-4bd0-a988-0f7c43893238"
                ],
                "prompt": "Hi AI, plz based on the {EVENT IDs} give me some suggestions to defend "
            },
            {
                "id": "f3d851da-3900-4d5f-8e9d-290794740c3c",
                "name": "attack time",
                "type": 'Normal',
                "position": {
                    "x": 800,
                    "y": 300
                },
                "forwards": [
                    "336ba94b-9315-40c3-a9fa-5cf668d50182"
                ],
                "prompt": "Hi AI, plz based on the {ALL | SPECIAL CONDITIONS} give me the last {NUMBER} time"
            },
            {
                "id": "b4f73c61-e5ae-402d-8dc9-88eb3f7f265b",
                "name": "attack times",
                "type": 'Normal',
                "position": {
                    "x": 800,
                    "y": 150
                },
                "forwards": [
                    "336ba94b-9315-40c3-a9fa-5cf668d50182"
                ],
                "prompt": "Hi AI, plz base on {EVEND ID} find {ALL | SPECIAL CONDITIONS} attack source, and count the attack times"
            },
            {
                "id": "77fc586a-4ce7-4e57-9398-73750d91fdfe",
                "name": "the attack source",
                "type": 'Normal',
                "position": {
                    "x": 800,
                    "y": 0
                },
                "forwards": [
                    "336ba94b-9315-40c3-a9fa-5cf668d50182"
                ],
                "prompt": "Hi AI, plz give me the attack source in {ALL | SPECIAL EVENT IDs}."
            },
            {
                "id": "72f17e4e-7e55-4bd0-a988-0f7c43893238",
                "name": "Done",
                "type": 'Output',
                "position": {
                    "x": 1600,
                    "y": 0
                },
                "forwards": []
            },
            {
                "id": "e369cd2b-6e2f-472e-aeef-97147b4d2782",
                "name": "IP prompt",
                "type": 'Normal',
                "position": {
                    "x": 400,
                    "y": 0
                },
                "forwards": [
                    "77fc586a-4ce7-4e57-9398-73750d91fdfe",
                    "b4f73c61-e5ae-402d-8dc9-88eb3f7f265b",
                    "f3d851da-3900-4d5f-8e9d-290794740c3c"
                ],
                "prompt": "Hi AI, plz list all attack events regarding {THE IPs}."
            },
            {
                "id": "6dc25c53-7615-47f5-a3f8-9c25b565e915",
                "name": "Upload",
                "type": 'Input',
                "position": {
                    "x": 0,
                    "y": 0
                },
                "forwards": [
                    "e369cd2b-6e2f-472e-aeef-97147b4d2782"
                ]
            }
        ]
    }
]