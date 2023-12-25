import apiCaller from "./api-caller"

import { ApiResult } from "@/interface/api"
import { ICustomCompData } from "@/interface/flow"

export const createComponent = async (comp: ICustomCompData) => {
    return await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_CREATECOMPONENT}`, comp)
}

export const updateComponent = async (comp: ICustomCompData) => {
    return await apiCaller.post<ApiResult<ICustomCompData>>(`${process.env.NEXT_PUBLIC_UPDATECOMPONENT}`, comp)
}

export const disableComponent = async (id?: string) => {
    return await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_DISABLECOMPONENT}/${id || ''}`,);
}