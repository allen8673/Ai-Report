import _ from "lodash"
import { useSearchParams } from "next/navigation";
import { NextRequest } from 'next/server'

import { mock_templates } from "@/mock-data/mock"

// export const dynamic = "force-static";
export async function GET(request: NextRequest) {
    const searchParams = useSearchParams();
    // const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    console.log(id)
    const data = _.map(mock_templates, d => ({ id: d.id, name: d.name }))
    return Response.json({ data })
}


