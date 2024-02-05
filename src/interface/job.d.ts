import { FlowStatus } from './flow'

export interface IJob {
    JOB_ID: string;
    WORKFLOW_ID: string;
    VERSION: number;
    CREATE_USER: string;
    CREATE_TIME: string;
    MODIFY_USER: string;
    MODIFY_TIME: string;
    STATUS: string;
    ERR_MSG?: string;
    JOBNAME?: string;
}

export interface IJobStatus {
    CREATE_TIME: string;
    ITEMS: IJobItem[];
    JOBNAME?: string;
    JOB_ID: string;
    REPORTDATA?: string;
    STATUS: 'finish' | 'not finish'
}

export interface IJobItem {
    JOB_ID: string;
    WORKFLOW_ID: string;
    ITEM_ID: string;
    VERSION: number;
    STATUS: FlowStatus;
    REPORTDATA?: string;
}

export interface IJobList {
    finish: IJob[];
    ongoing: IJob[];
}