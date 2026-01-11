import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const table = await sql`SELECT to_regclass('public.vehiculo') AS vehiculo;`;
    const cols = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'vehiculo'
      ORDER BY ordinal_position;
    `;

    return NextResponse.json({
      ok: true,
      vehiculo_table: table.rows?.[0]?.vehiculo ?? null,
      columns: cols.rows.map(r => r.column_name),
    });
  } catch (e: any) {
    console.error("DB-CHECK ERROR:", e);
    return NextResponse.json(
      { ok: false, message: e?.message, code: e?.code, detail: e?.detail },
      { status: 500 }
    );
  }
}
