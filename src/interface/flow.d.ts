import { XYPosition } from "reactflow";

export interface IFlowBase {
    id: string;
    name: string;
    used?: string[]
}

export interface IFlow extends IFlowBase {
    type: 'workflow' | 'template',
    rootNdeId: string[];
    flows: IFlowNode[];
}

export type FlowType = 'Input' | 'Output' | 'Normal' | 'Workflow' | 'Report';
export type FlowStatus = 'none' | 'success' | 'failure' | 'warning';
export interface IFlowNodeBase {
    id: string;
    type: FlowType;
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
    workflowstatus?: 'disable' | 'enable' | '';
    apimode?: string
}

export interface IEditFlow {
    id?: string;
    name?: string;
    template?: string;
}

export interface ISaveFlow {
    workflowid?: string
}

