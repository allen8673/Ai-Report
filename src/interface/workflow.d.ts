import { XYPosition } from "reactflow";


export interface IEditWorkflow {
    id?: string;
    name?: string;
    template?: string;
}

/**
 * the interface for the diagram of AI report
 */
export interface IWorkflow {
    type: 'workflow' | 'template',
    id: string;
    name: string;
    rootNdeId: string[];
    flows: IFlowNode[];
}

export type FlowTyep = 'Input' | 'Output' | 'Normal' | 'Workflow';
export type FlowStatus = 'none' | 'success' | 'failure' | 'warning';
export interface IFlowNodeBase {
    id: string;
    type: FlowTyep;
    name?: string;
    groupId?: string;
}
export interface IFlowNode extends IFlowNodeBase {
    position: XYPosition;
    forwards: string[];
    prompt?: string;
    depth?: number;
    workflowId?: string;
    file?: any;
    report?: any;
    running?: boolean;
    status?: FlowStatus;
}

