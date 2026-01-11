import { NextRequest, NextResponse } from "next/server";
import { getVehiculoByPlaca } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Esta API es PÚBLICA - no requiere autenticación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));

    let numeroPlaca = body?.numeroPlaca ?? body?.numeroplaca;

    if (!numeroPlaca) {
      return NextResponse.json(
        { error: "Número de placa requerido" },
        { status: 400 }
      );
    }

    // Convertir placa siempre a string y mayúsculas
    numeroPlaca = String(numeroPlaca).toUpperCase().trim();

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
