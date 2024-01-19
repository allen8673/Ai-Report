import { XYPosition } from "reactflow";

export interface IFlowBase {
    id: string;
    name: string;
    used?: string[]
}

export interface IFlow extends IFlowBase {
    type: 'workflow' | 'template';
    rootNdeId: string[];
    flows: IFlowNode[];
    VERSION: number;
}

export type FlowType = 'Input' | 'Output' | 'Normal' | 'Workflow' | 'Report';
export type FlowStatus = 'none' | 'success' | 'failure' | 'warning';

export interface ComponentOpt {
    COMP_ID: string;
    COMP_NAME: string;
    COMP_TYPE: FlowType;
    APIMODE: string;
}

export interface SysPromptOpt {
    PROMPT_ID: number;
    PROMPT_NAME: string,
    PROMPT_CONTENT: string;
}

export interface IReportCompData {
    id: string;
    name: string;
    comp_type: FlowType;
}

export interface ICustomCompData {
    id: string;
    name: string;
    comp_name: string;
    comp_type: FlowType;
    apimode: string;
    prompt: string;
    owner: string;
    user: string;
    syspromptid?: number;
}

export interface IFlowNode extends IFlowNodeBase {
    id: string;
    type: FlowType;
    name?: string;
    position: XYPosition;
    forwards: string[];
    prompt?: string;
    depth?: number;
    workflowid?: string;
    report?: any;
    running?: boolean;
    status?: FlowStatus;
    workflowstatus?: 'disable' | 'enable' | '';
    apimode?: string;
    syspromptid?: number;
}

export interface IEditFlow {
    id?: string;
    name?: string;
    template?: string;
}

export interface ISaveFlow {
    workflowid?: string
}

