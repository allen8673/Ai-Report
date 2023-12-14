
import apiCaller from "./api-caller";

import { ApiResult } from "@/interface/api";
import { ISaveFlow, IFlow, IFlowBase } from "@/interface/flow";

export const getFlows = async (type: 'WORKFLOW' | "TEMPLATE" = 'WORKFLOW') => {
    const flows = (await apiCaller.get<ApiResult<IFlow[]>>(`${process.env.NEXT_PUBLIC_FLOWS_API}/${type}`)).data.data;
    return flows || []
}

export const getFlow = async (id?: string) => {
    if (!id) return undefined
    const flow = await (await apiCaller.get<ApiResult<IFlow>>(`${process.env.NEXT_PUBLIC_FLOW_API}/${id}`)).data.data
    return flow
}

export const getAll = async () => {
    const wfs = (await apiCaller.get<ApiResult<{
        workflow: IFlowBase[],
        template: IFlowBase[]
    }>>(`${process.env.NEXT_PUBLIC_FLOWS_API}/ALL`)).data.data;
    return wfs
}


export const addFlow = async (flow: IFlow) => {
    return await apiCaller.post<ApiResult<ISaveFlow>>(`${process.env.NEXT_PUBLIC_CREATEFLOW}`, flow)
}

export const updateFlow = async (flow: IFlow) => {
    return await apiCaller.post<ApiResult<ISaveFlow>>(`${process.env.NEXT_PUBLIC_UPDATEFLOW}`, flow)
}

export const deleteFlow = async (id?: string) => {
    return await apiCaller.post<ApiResult>(`${process.env.NEXT_PUBLIC_DISABLEFLOW}/${id || ''}`,);
}


