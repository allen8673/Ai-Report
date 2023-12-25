import apiCaller from "./api-caller"

import { ApiResult } from "@/interface/api"
import { IReportCompData } from "@/interface/flow"

export const createComponent = async (module: IReportCompData) => {
    return await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_CREATECOMPONENT}`, module)
}

export const updateComponent = async (module: IReportCompData) => {
    return await apiCaller.post<ApiResult<IReportCompData>>(`${process.env.NEXT_PUBLIC_UPDATECOMPONENT}`, module)
}

export const disableComponent = async (id?: string) => {
    return await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_DISABLECOMPONENT}/${id || ''}`,);
}