import apiCaller from "./api-caller";

import { ApiResult } from "@/interface/api";
import { DrawData } from "@/interface/draw";

const DRAWS_URL = process.env.NEXT_PUBLIC_DRAWS_URL;

export const addDraw = async (id: string, html: string) => {
    if (!DRAWS_URL) throw Error('No value be assigned to NEXT_PUBLIC_DRAWS_URL');

    if (!id || !html) return
    await apiCaller.post(DRAWS_URL, { id: id.replace(/^shape:/, ''), html })
}

export const getDraw = async (id: string) => {
    if (!DRAWS_URL) throw Error('No value be assigned to NEXT_PUBLIC_DRAWS_URL');
    if (!id) return
    return (await apiCaller.get<ApiResult<DrawData | undefined>>(`${DRAWS_URL}/${id}`)).data
}

