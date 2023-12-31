
import { mock_workflows, mock_templates } from "@/app/api/mock-data";
import { ApiResult } from "@/interface/api";
import { IFlowBase } from "@/interface/flow";

export async function GET() {
    const data: ApiResult<{
        workflow: IFlowBase[],
        template: IFlowBase[]
    }> = {
        status: 'success', data: { workflow: mock_workflows, template: mock_templates }
    }

    return Response.json(data)
}
