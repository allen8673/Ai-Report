import apiCaller from "./api-caller";

import { ApiResult } from "@/interface/api";
import { ComponentData } from "@/interface/master";

export const getComponents = async () => {
    const flows = (await apiCaller.get<ApiResult<ComponentData[]>>(`${process.env.NEXT_PUBLIC_MASTER}/getComponents`)).data.data;
    return flows || []
}