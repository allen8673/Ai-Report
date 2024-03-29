import apiCaller from "./api-caller";

import { ApiResult } from "@/interface/api";
import { ComponentOpt, ICustomCompData, SysPromptOpt } from "@/interface/flow";

export const getComponentOpts = async () => {
    const flows = (await apiCaller.get<ApiResult<ComponentOpt[]>>(`${process.env.NEXT_PUBLIC_MASTER}/getComponents`)).data.data;
    return flows || []
}

export const getCustomComponents = async () => {
    const flows = (await apiCaller.get<ApiResult<ICustomCompData[]>>(`${process.env.NEXT_PUBLIC_MASTER}/getComponentsdetail`)).data.data;
    return flows || []
}

export const getSysprompts = async () => {
    const sysPromptOpts = (await apiCaller.get<ApiResult<SysPromptOpt[]>>(`${process.env.NEXT_PUBLIC_MASTER}/getSysprompts`)).data.data;
    return sysPromptOpts || []
}