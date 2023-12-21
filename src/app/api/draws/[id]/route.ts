import { sql } from "@vercel/postgres"

import { ApiResult } from "@/interface/api";
import { DrawData } from "@/interface/draw";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const query_result = await sql`SELECT * FROM draws WHERE id=${params.id}`;
    const result: ApiResult<DrawData | undefined> = { status: 'success', data: (query_result.rows[0] as DrawData) }
    return Response.json(result)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await sql`DELETE FROM draws WHERE id=${params.id}`;
    return Response.json('ok')
}