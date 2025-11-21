"use client";

import { useEffect, useState } from "react";
import RegisterPlaca from "@/components/RegisterPlaca";

interface Vehiculo {
  numeroplaca: string;
  tipotransporte: string;
  vigencia: string;
  activo: boolean;
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarVehiculos = async () => {
    try {
      const res = await fetch("/api/vehiculos");
      const data = await res.json();
     console.log("Vehículos cargados:", data);
      setVehiculos(data);
    } catch (err) {
      console.error("Error cargando vehículos", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivo = async (numeroplaca: string, nuevoEstado: boolean) => {
    try {
      await fetch("/api/estado", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroplaca, activo: nuevoEstado }),
      });


      cargarVehiculos(); // recargar
    } catch (err) {
      console.error("Error al actualizar estado", err);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  if (loading) return <p className="p-6 text-xl">Cargando vehículos...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Vehículos Registrados</h1>

<RegisterPlaca/>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-2">Placa</th>
            <th className="border p-2">Tipo Transporte</th>
            <th className="border p-2">Vigencia</th>
            <th className="border p-2 text-center">Activo</th>
          </tr>
        </thead>

        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.numeroplaca} className="hover:bg-gray-50">
              <td className="border p-2">{v.numeroplaca}</td>
              <td className="border p-2">{v.tipotransporte}</td>
              <td className="border p-2">{v.vigencia}</td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={v.activo}
                  onChange={(e) =>
                    toggleActivo(v.numeroplaca, e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
