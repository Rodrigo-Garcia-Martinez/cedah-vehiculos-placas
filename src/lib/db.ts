import { sql } from '@vercel/postgres';

export interface Vehiculo {
  id: number;
  numeroplaca: string;
  tipotransporte: string;
  vigencia: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getVehiculoByPlaca(numeroplaca: string): Promise<Vehiculo | null> {
  try {
    const result = await sql<Vehiculo>`
      SELECT * FROM vehiculo 
      WHERE numeroplaca = ${numeroplaca}
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error al buscar vehículo:', error);
    throw new Error('Error al consultar la base de datos');
  }
}

export async function createVehiculo(
  numeroPlaca: number,
  tipotransporte: string,
  vigencia: string
): Promise<Vehiculo> {
  try {
    const result = await sql<Vehiculo>`
      INSERT INTO vehiculo (numeroplaca, tipotransporte, vigencia, activo)
      VALUES (${numeroPlaca}, ${tipotransporte}, ${vigencia}, true)
      RETURNING *
    `;
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') { // Duplicate key error
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