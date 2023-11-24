import _ from "lodash"

import { mock_templates } from "@/mock-data/mock"

export function generateStaticParams() {
    return _.map(mock_templates, i => ({ id: i.id }))
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const data = _.find(mock_templates, ['id', params.id])
    return Response.json({ data })
}

export async function POST() {
    return Response.json({ data: 'haha' })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    _.remove(mock_templates, ['id', params.id]);
    return Response.json({ data: 'ok' })

}