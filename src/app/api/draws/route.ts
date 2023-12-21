import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";
import { v4 } from "uuid";

import { DrawData } from "@/interface/draw";

export async function POST(request: NextRequest) {
    const data = await request.json() as DrawData;
    if (!!data.html) {
        const id = v4();
        await sql`INSERT INTO draws (id, html) VALUES (${id}, ${data.html})`
        return Response.json('ok');
    }
    return Response.json('NG');

}