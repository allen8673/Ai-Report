import _ from "lodash";
import { NextRequest } from "next/server";

import { ApiResult } from "@/interface/api";
import { IWorkflow } from "@/interface/workflow";
import { mock_workflows } from "@/mock-data/mock";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    const data = id ? _.find(mock_workflows, ['id', id]) : _.map(mock_workflows, d => ({ id: d.id, name: d.name }));
    return Response.json(data || null)
}

export async function POST(request: NextRequest) {
    const data = await request.json() as (IWorkflow | undefined);
    const result: ApiResult = { status: 'success' }
    if (!data || !data?.id) {
        result.status = 'failure';
        result.message = 'invalid data';
        return Response.json(result)
    }
    mock_workflows.push(data);
    return Response.json(result)
}

export async function PUT(request: NextRequest) {
    const data = await request.json() as (IWorkflow | undefined);
    const result: ApiResult = { status: 'success' }
    if (!data || !data?.id) {
        result.status = 'failure';
        result.message = 'invalid data';
        return Response.json(result)
    }

    const old_idx = _.findIndex(mock_workflows, ['id', data.id])
    if (old_idx === -1) {
        result.status = 'failure';
        result.message = 'no such data';
        return Response.json(result)
    }

    mock_workflows.splice(old_idx, 1, data)
    return Response.json(result)
}

export async function DELETE(request: NextRequest) {
    const id: string = request.nextUrl.searchParams.get('id') || '';
    const result: ApiResult = { status: 'success' }
    if (!id) {
        result.status = 'failure';
        result.message = 'invalid id';
        return Response.json(result)
    }

    _.remove(mock_workflows, ['id', id]);
    return Response.json(result)
}