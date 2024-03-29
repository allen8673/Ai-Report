import apiCaller from "./api-caller"

import { ApiResult } from "@/interface/api"
import { IJob, IJobList, IJobStatus } from "@/interface/job"

export const runReport = async (formData: FormData) => {
    return (await (apiCaller.post<ApiResult<string>>(`${process.env.NEXT_PUBLIC_REPORT}/run`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            // "x-rapidapi-host": "file-upload8.p.rapidapi.com",
            // "x-rapidapi-key": "your-rapidapi-key-here",
        },
    }))).data
}

export const downloadJob = async (jobId: string) => {
    return (await apiCaller.get(`${process.env.NEXT_PUBLIC_REPORT}/download/${jobId}`)).data
}

export const checkJob = async (flowid: string) => {
    return (await apiCaller.get<ApiResult>(`${process.env.NEXT_PUBLIC_REPORT}/check/${flowid}`)).data
}


export const getJobItemStatus = async (jobid: string) => {
    return (await apiCaller.get<ApiResult<IJobStatus>>(`${process.env.NEXT_PUBLIC_REPORT}/getJobItemStatus/${jobid}`)).data.data
}

export const getJobslist = async (workflowId: string) => {
    return (await apiCaller.get<ApiResult<IJobList>>(`${process.env.NEXT_PUBLIC_REPORT}/getJobslist/${workflowId}`)).data.data
}

/**
 * @deprecated
 */
export const getJobs = async (workflowId?: string) => {
    return (await apiCaller.get<ApiResult<IJob[]>>(`${process.env.NEXT_PUBLIC_REPORT}/getJobs/${workflowId || ''}/1`)).data
}

/**
 * @deprecated
 */
export const getJobsOngoing = async (flowid: string) => {
    return (await apiCaller.get<ApiResult<IJob[]>>(`${process.env.NEXT_PUBLIC_REPORT}/getJobsOngoing/${flowid}`)).data.data
}