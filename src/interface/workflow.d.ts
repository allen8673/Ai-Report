import { XYPosition } from "reactflow";

export interface IWorkflow {
    id: string;
    name: string;
    flows: IFlow[]
}

export type FlowTyep = 'prompt' | 'file-upload' | 'file-download';
export type FlowStatus = 'none' | 'success' | 'failure';
export interface IFlowBase {
    id: string;
    type: FlowTyep;
    name: string;
}
export interface IFlow extends IFlowBase {
    promt?: string;
    file?: any;
    forwards?: string[];
    position: XYPosition;
    running?: boolean;
    status?: FlowStatus;
}

