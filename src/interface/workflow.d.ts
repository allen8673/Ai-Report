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
    id: string;
    name: string;
    rootNdeId: string[];
    flows: IFlow[];
}

/**
 * the interface for the template
 */
export interface ITemplate {
    id: string;
    name: string;
    flows: IFlow[]
    rootNdeId: string[];
}

export type FlowTyep = 'Input' | 'Output' | 'Normal' | 'Workflow';
export type FlowStatus = 'none' | 'success' | 'failure' | 'warning';
export interface IFlowBase {
    id: string;
    type: FlowTyep;
    name?: string;
}
export interface IFlow extends IFlowBase {
    prompt?: string;
    file?: any;
    report?: any;
    forwards?: string[];
    position: XYPosition;
    running?: boolean;
    status?: FlowStatus;
    depth?: number;
    workflowId?: string;
}

