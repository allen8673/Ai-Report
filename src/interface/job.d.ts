export interface IJob {
    JOB_ID: string;
    WORKFLOW_ID: string;
    VERSION: number;
    Create_User: string;
    Create_Time: string;
    Modify_User: string;
    Modify_Time: string;
    STATUS: string;
    ERR_MSG?: string
}

export interface IJobStatus {
    JOB_ID: string;
    WORKFLOW_ID: string;
    ITEM_ID: string;
    VERSION: number;
    STATUS: string;
}