import { NextResponse } from "next/server";
import { getAllVehiculos } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth/next";

export async function GET() {
  // 🔐 Validar sesión
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const vehiculos = await getAllVehiculos();
    return NextResponse.json(vehiculos);
  } catch (err) {
    return NextResponse.json(
      { error: "Error obteniendo vehículos" },
      { status: 500 }
    );
  }
}
