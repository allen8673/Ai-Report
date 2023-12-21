import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

import { DrawData } from "@/interface/draw";

export async function POST(request: NextRequest) {
    const { id, html } = await request.json() as DrawData;
    if (!html || !id) return Response.json('NG');
    await sql`INSERT INTO draws (id, html) VALUES (${id}, ${html})`
    return Response.json('ok');

}