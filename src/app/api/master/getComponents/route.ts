import { mock_component_data } from "@/app/api/mock-data"
import { ApiResult } from "@/interface/api"
import { ComponentOpt } from "@/interface/flow"


export async function GET() {
    const data: ApiResult<ComponentOpt[]> = {
        status: 'ok', data: mock_component_data
    }
    return Response.json(data)
}
