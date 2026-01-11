import { sql } from '@vercel/postgres';

export interface Vehiculo {
  id: number;
  numeroPlaca: string;
  tipoTransporte : string;
  vigencia: string;
  activo: boolean;
  serie: string;
  created_at?: string;
  updated_at?: string;
}


export async function getVehiculoByPlaca(numeroPlaca: string): Promise<Vehiculo | null> {
  try {
    const result = await sql<Vehiculo>`
      SELECT * FROM vehiculo
      WHERE numeroPlaca = ${numeroPlaca}
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error al buscar vehículo:', error);
    throw new Error('Error al consultar la base de datos');
  }
}


export async function createVehiculo(
  numeroPlaca: string,
  tipoTransporte : string,
  vigencia: string
): Promise<Vehiculo> {
  try {
    const result = await sql<Vehiculo>`
      INSERT INTO vehiculo (numeroPlaca, tipoTransporte , vigencia, activo)
      VALUES (${numeroPlaca}, ${tipoTransporte }, ${vigencia}, true)
      RETURNING *
    `;
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Esta placa ya está registrada');
    }
    console.error('Error al crear vehículo:', error);
    throw new Error('Error al registrar la placa');
  }
}

export async function getAllVehiculos(): Promise<Vehiculo[]> {
  try {
    const result = await sql<Vehiculo>`
      SELECT * FROM vehiculo
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    throw new Error('Error al consultar la base de datos');
  }
}
