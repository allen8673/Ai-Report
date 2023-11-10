export type FlowTyep = 'file-upload' | 'prompt' | 'file-download';

export interface IReportItem {
    id: string;
    name: string;
    type: FlowTyep;
}