import { NextRequest, NextResponse } from "next/server";
import { getVehiculoByPlaca } from "@/lib/db";

// Esta API es PÚBLICA - no requiere autenticación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let numeroPlaca = body.numeroPlaca ?? body.numeroplaca;

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
        { found: false, message: "Placa no encontrada en el sistema" },
        { status: 404 }
      );
    }

    const vigenciaDate = new Date(vehiculo.vigencia);
    const hoy = new Date();
    const esVigente = vigenciaDate >= hoy && vehiculo.activo;

    return NextResponse.json({
      found: true,
      vehiculo: {
        ...vehiculo,
        esVigente,
        diasRestantes: Math.ceil(
          (vigenciaDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
    });
  } catch (error: any) {
    console.error("Error en validación:", error);
    return NextResponse.json(
      { error: error.message || "Error al validar la placa" },
      { status: 500 }
    );
  }
}