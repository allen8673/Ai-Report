import _ from "lodash"
import { NextRequest } from 'next/server'

import { mock_templates } from "@/mock-data/mock"

export async function GET(request: NextRequest) {
    // const searchParams = useSearchParams();
    const id = request.nextUrl.searchParams.get('id');
    const data = id ? _.find(mock_templates, ['id', id]) : _.map(mock_templates, d => ({ id: d.id, name: d.name }))
    return Response.json({ data })
}


