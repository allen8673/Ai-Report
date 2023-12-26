import { ApiResult } from "@/interface/api"
import { ComponentOpt } from "@/interface/flow"
import { mock_component_data } from "@/mock-data/mock"


export async function GET() {
    const data: ApiResult<ComponentOpt[]> = {
        status: 'ok', data: mock_component_data
    }
    return Response.json(data)
}
