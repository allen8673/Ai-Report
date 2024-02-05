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
    JOB_ID: string;
    WORKFLOW_ID: string;
    ITEM_ID: string;
    VERSION: number;
    STATUS: FlowStatus;
}

export interface IJobList {
    finish: IJob[];
    ongoing: IJob[];
}