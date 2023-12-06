import _ from "lodash"
import { NextRequest } from 'next/server'
import { v4 } from "uuid";

import { ApiResult } from "@/interface/api";
import { ITemplate } from "@/interface/workflow";
import { mock_templates } from "@/mock-data/mock"

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    const data = id ? _.find(mock_templates, ['id', id]) : _.map(mock_templates, d => ({ id: d.id, name: d.name }))
    return Response.json(data || null)
}

export async function POST(request: NextRequest) {
    const data = await request.json() as (ITemplate | undefined);
    const result: ApiResult = { status: 'success' }
    if (!data) {
        result.status = 'failure';
        result.message = 'invalid data';
        return Response.json(result)
    }
    mock_templates.push({ ...data, id: v4() });
    // result.data = mock_templates
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

    _.remove(mock_templates, ['id', id]);
    return Response.json(result)
}
