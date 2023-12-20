import { ApiResult } from "@/interface/api"
import { ComponentData } from "@/interface/master"
import { mock_component_data } from "@/mock-data/mock"


export async function GET() {
    const data: ApiResult<ComponentData[]> = {
        status: 'ok', data: mock_component_data
    }
    return Response.json(data)
}
