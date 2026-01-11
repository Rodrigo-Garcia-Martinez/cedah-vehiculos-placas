import { sql } from '@vercel/postgres';

export interface Vehiculo {
  id: number;
  numeroPlaca: string;
  tipoTransporte: string;
  vigencia: string; // o Date si prefieres
  activo: boolean;
  serie: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getVehiculoByPlaca(numeroPlaca: string): Promise<Vehiculo | null> {
  try {
    const result = await sql<Vehiculo>`
      SELECT
        id,
        "numeroPlaca",
        "tipoTransporte",
        vigencia,
        activo,
        serie,
        created_at,
        updated_at
      FROM vehiculo
      WHERE "numeroPlaca" = ${numeroPlaca}
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error: any) {
    console.error('Error al buscar vehículo (detalle):', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
    });
    throw new Error('Error al consultar la base de datos');
  }
}

export async function createVehiculo(
  numeroPlaca: string,
  tipoTransporte: string,
  vigencia: string
): Promise<Vehiculo> {
  try {
    const result = await sql<Vehiculo>`
      INSERT INTO vehiculo ("numeroPlaca", "tipoTransporte", vigencia, activo)
      VALUES (${numeroPlaca}, ${tipoTransporte}, ${vigencia}, true)
      RETURNING
        id,
        "numeroPlaca",
        "tipoTransporte",
        vigencia,
        activo,
        serie,
        created_at,
        updated_at
    `;
    return result.rows[0];
  } catch (error: any) {
    if (error?.code === '23505') {
      throw new Error('Esta placa ya está registrada');
    }
    console.error('Error al crear vehículo (detalle):', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
    });
    throw new Error('Error al registrar la placa');
  }
}

export async function getAllVehiculos(): Promise<Vehiculo[]> {
  try {
    const result = await sql<Vehiculo>`
      SELECT
        id,
        "numeroPlaca",
        "tipoTransporte",
        vigencia,
        activo,
        serie,
        created_at,
        updated_at
      FROM vehiculo
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error: any) {
    console.error('Error al obtener vehículos (detalle):', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
    });
    throw new Error('Error al consultar la base de datos');
  }
}
export async function getVehiculoBySerie(serie: string): Promise<Vehiculo | null> {
  const result = await sql<Vehiculo>`
    SELECT id, "numeroPlaca", "tipoTransporte", vigencia, activo, serie, created_at, updated_at
    FROM vehiculo
    WHERE serie = ${serie}
    LIMIT 1
  `;
  return result.rows[0] || null;
}


