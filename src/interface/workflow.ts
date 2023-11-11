export interface IWorkflow {
    id: string;
    name: string;
    flows: IFlow[]
}

export type FlowTyep = 'prompt' | 'file-upload' | 'file-download';

export interface IFlow {
    id: string;
    type: FlowTyep;
    name: string;
    sources?: string[];
    targets?: string[];
}