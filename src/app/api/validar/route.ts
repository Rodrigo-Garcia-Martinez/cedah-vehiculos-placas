import { NextRequest, NextResponse } from "next/server";
import { getVehiculoByPlaca } from "@/lib/db";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));
    let numeroPlaca = body?.numeroPlaca ?? body?.numeroplaca;

    if (!numeroPlaca) {
      return NextResponse.json({ error: "Número de placa requerido" }, { status: 400 });
    }

    numeroPlaca = String(numeroPlaca).toUpperCase().trim();

    // ✅ Diagnóstico BD (temporal)
    const reg = await sql`SELECT to_regclass('public.vehiculo') AS t;`;
    console.log("to_regclass(public.vehiculo):", reg.rows?.[0]?.t);

    const cols = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='vehiculo'
      ORDER BY ordinal_position;
    `;
    console.log("vehiculo columns:", cols.rows.map(r => r.column_name));
    // Buscar vehículo
    const vehiculo = await getVehiculoByPlaca(numeroPlaca);

    if (!vehiculo) {
      return NextResponse.json(
        { found: false, message: "Error: Datos de placa no registrados en CNE" },
        { status: 404 }
      );
    }

    // vigencia es tipo DATE en Postgres; esto evita problemas de zona horaria:
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vigenciaDate = new Date(vehiculo.vigencia);
    vigenciaDate.setHours(0, 0, 0, 0);

    const esVigente = vigenciaDate >= hoy && vehiculo.activo;

    const diasRestantes = Math.ceil(
      (vigenciaDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json(
      {
        found: true,
        vehiculo: {
          ...vehiculo,
          esVigente,
          diasRestantes,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en validación (detalle):", {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      stack: error?.stack,
    });

    return NextResponse.json(
      { error: "Error al consultar la base de datos" },
      { status: 500 }
    );
  }
}

