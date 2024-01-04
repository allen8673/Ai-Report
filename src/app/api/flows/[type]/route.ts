import { mock_workflows, mock_templates } from "@/app/api/mock-data";
import { ApiResult } from "@/interface/api";
import { IFlow } from "@/interface/flow";
export function generateStaticParams() {
    return [{ type: 'WORKFLOW' }, { type: 'TEMPLATE' }]
}

export async function GET(request: Request, { params }: { params: { type: 'WORKFLOW' | "TEMPLATE" } }) {
    const data: ApiResult<IFlow[]> = {
        status: 'success',
        data: params.type === 'TEMPLATE' ? mock_templates : mock_workflows
    }
    return Response.json(data)
}