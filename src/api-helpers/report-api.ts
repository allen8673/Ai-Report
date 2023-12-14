import apiCaller from "./api-caller"

import { ApiResult } from "@/interface/api"
import { IJob } from "@/interface/job"

export const getJobs = async (workflowId?: string) => {
    return (await apiCaller.get<ApiResult<IJob[]>>(`${process.env.NEXT_PUBLIC_REPORT}/getJobs/${workflowId || ''}/1`)).data
}

export const runReport = async (formData: FormData) => {
    return (await (apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_REPORT}/run`, formData, {
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