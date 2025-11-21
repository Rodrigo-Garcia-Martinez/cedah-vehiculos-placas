import { NextRequest, NextResponse } from 'next/server';
import { getVehiculoByPlaca } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
const body = await request.json();
const numeroPlaca = body.numeroPlaca ?? body.numeroplaca; // acepta ambos


if (!numeroPlaca || typeof numeroPlaca !== "string") {
      return NextResponse.json(
        { error: 'Número de placa inválido' },
        { status: 400 }
      );
    }

    const vehiculo = await getVehiculoByPlaca(numeroPlaca.trim().toUpperCase());


    if (!vehiculo) {
      return NextResponse.json(
        { 
          found: false, 
          message: 'Placa no encontrada en el sistema' 
        },
        { status: 404 }
      );
    }

    // Verificar vigencia
    const vigenciaDate = new Date(vehiculo.vigencia);
    const hoy = new Date();
    const esVigente = vigenciaDate >= hoy && vehiculo.activo;

    return NextResponse.json({
      found: true,
      vehiculo: {
        ...vehiculo,
        esVigente,
        diasRestantes: Math.ceil((vigenciaDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error: any) {
    console.error('Error en validación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al validar la placa' },
      { status: 500 }
    );
  }
}