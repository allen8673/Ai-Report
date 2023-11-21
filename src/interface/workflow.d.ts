import { XYPosition } from "reactflow";

export interface IEditWorkflow {
    id?: string;
    name: string;
    template?: string[];
}

export interface IWorkflow {
    id: string;
    name: string;
    template: string;
    rootNdeId: string;
    flows: IFlow[];
    // updater: string;
}

export interface ITemplate {
    id: string;
    name: string;
    flows: IFlow[]
}

export type FlowTyep = 'prompt' | 'file-upload' | 'file-download';
export type FlowStatus = 'none' | 'success' | 'failure' | 'warning';
export interface IFlowBase {
    id: string;
    type: FlowTyep;
    name: string;
}
export interface IFlow extends IFlowBase {
    promt?: string;
    file?: any;
    report?: any;
    forwards?: string[];
    position: XYPosition;
    running?: boolean;
    status?: FlowStatus;
}

