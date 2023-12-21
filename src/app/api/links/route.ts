import { sql } from "@vercel/postgres"



export async function GET() {
    const id = 'test'
    const result = await sql`SELECT html FROM links WHERE id=${id}`
    return Response.json(result)
}
