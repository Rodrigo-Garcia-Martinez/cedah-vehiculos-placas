import { NextRequest, NextResponse } from 'next/server';
import { createVehiculo } from '@/lib/db';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numeroPlaca, tipoTransporte, vigencia } = body;

    // Validaciones
    if (!numeroPlaca || numeroPlaca.trim() === '') {
      return NextResponse.json(
        { error: 'Número de placa inválido' },
        { status: 400 }
      );
    }

    if (!tipoTransporte || tipoTransporte.trim() === '') {
      return NextResponse.json(
        { error: 'Tipo de transporte es requerido' },
        { status: 400 }
      );
    }

    if (!vigencia) {
      return NextResponse.json(
        { error: 'Fecha de vigencia es requerida' },
        { status: 400 }
      );
    }

    // Validar que la fecha sea futura
    const vigenciaDate = new Date(vigencia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (vigenciaDate < hoy) {
      return NextResponse.json(
        { error: 'La fecha de vigencia debe ser futura' },
        { status: 400 }
      );
    }

    const vehiculo = await createVehiculo(
      numeroPlaca,
      tipoTransporte,
      vigencia
    );

    return NextResponse.json({
      success: true,
      message: 'Placa registrada exitosamente',
      vehiculo
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: error.message || 'Error al registrar la placa' },
      { status: 500 }
    );
  }
}