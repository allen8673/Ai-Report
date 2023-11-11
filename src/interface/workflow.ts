import { XYPosition } from "reactflow";

export interface IWorkflow {
    id: string;
    name: string;
    flows: IFlow[]
}

export type FlowTyep = 'prompt' | 'file-upload' | 'file-download';

export interface IFlowBase {
    id: string;
    type: FlowTyep;
    name: string;
}

export interface IFlow extends IFlowBase {

    forwards?: string[];
    position: XYPosition
}

