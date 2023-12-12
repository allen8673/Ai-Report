import { XYPosition } from "reactflow";


export interface IEditWorkflow {
    id?: string;
    name?: string;
    template?: string;
}

export interface IWorkflowBase {
    id: string;
    name: string;
    used?: string[]
}

/**
 * the interface for the diagram of AI report
 */
export interface IWorkflow extends IWorkflowBase {
    type: 'workflow' | 'template',
    rootNdeId: string[];
    flows: IFlowNode[];
}

export type FlowTyep = 'Input' | 'Output' | 'Normal' | 'Workflow' | 'Report';
export type FlowStatus = 'none' | 'success' | 'failure' | 'warning';
export interface IFlowNodeBase {
    id: string;
    type: FlowTyep;
    name?: string;
}
export interface IFlowNode extends IFlowNodeBase {
    position: XYPosition;
    forwards: string[];
    prompt?: string;
    depth?: number;
    workflowid?: string;
    file?: any;
    report?: any;
    running?: boolean;
    status?: FlowStatus;
    fileName?: string;
}

export interface ISaveFlow {
    workflowid?: string
}

