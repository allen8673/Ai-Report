import apiCaller from "./api-caller";

import { ApiResult } from "@/interface/api";
import { ComponentOpt, IReportCompData } from "@/interface/flow";

export const getComponentOpts = async () => {
    const flows = (await apiCaller.get<ApiResult<ComponentOpt[]>>(`${process.env.NEXT_PUBLIC_MASTER}/getComponents`)).data.data;
    return flows || []
}

export const getCustomComponents = async () => {
    const flows = (await apiCaller.get<ApiResult<IReportCompData[]>>(`${process.env.NEXT_PUBLIC_MASTER}/getComponentsdetail`)).data.data;
    return flows || []
}