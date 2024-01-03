import _ from "lodash"

import { mock_templates, mock_workflows } from "@/app/api/mock-data"

export function generateStaticParams() {
    return _.map([...mock_templates, ...mock_workflows], i => ({ id: i.id }))
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const data = _.find([...mock_templates, ...mock_workflows], ['id', params.id])
    return Response.json({ data })
}
