import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hasDb = !!process.env.DATABASE_URL;
    const hasPg = !!process.env.POSTGRES_URL;

    const now = await sql`SELECT NOW() as now`;
    return NextResponse.json({
      ok: true,
      hasDatabaseUrl: hasDb,
      hasPostgresUrl: hasPg,
      now: now.rows?.[0]?.now ?? null,
    });
  } catch (e: any) {
    console.error("HEALTH ERROR:", e);
    return NextResponse.json(
      { ok: false, message: e?.message, code: e?.code, detail: e?.detail },
      { status: 500 }
    );
  }
}
