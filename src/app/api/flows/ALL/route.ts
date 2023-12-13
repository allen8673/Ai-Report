
import { ApiResult } from "@/interface/api";
import { IWorkflowBase } from "@/interface/workflow";
import { mock_workflows, mock_templates } from "@/mock-data/mock";

export async function GET() {
    const data: ApiResult<{
        workflow: IWorkflowBase[],
        template: IWorkflowBase[]
    }> = {
        status: 'success', data: { workflow: mock_workflows, template: mock_templates }
    }

    return Response.json(data)
}
