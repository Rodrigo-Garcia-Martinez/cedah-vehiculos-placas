'use client';

import { useEffect, useState } from "react";
// Importamos el componente Button y Badge de shadcn para la tabla
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import RegisterPlaca from "@/components/RegisterPlaca";
import { Check, X, Truck } from "lucide-react"; // Iconos para la tabla

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
      if (!res.ok) {
        throw new Error("Error al cargar datos");
      }
      const data = await res.json();
      setVehiculos(data);
    } catch (err) {
      console.error("Error cargando vehículos", err);
      // Opcional: mostrar un mensaje de error al usuario
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
      // Opcional: manejar el error con un Toast o notificación
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  if (loading) return <p className="p-6 text-xl text-center text-gray-600">Cargando vehículos...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
        <Truck className="w-7 h-7 text-indigo-600" />
        Gestión de Vehículos
      </h1>

      {/* Contenedor principal: Flex/Grid para la separación y columnas */}
      {/* En pantallas pequeñas (md: hasta 768px) se apilan, en medianas y grandes se colocan lado a lado */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* Columna de la Tabla (Ocupa más espacio) */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Listado de Placas Registradas</h2>
          
          {/* Tabla Estilizada */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo Transporte</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vigencia</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {vehiculos.map((v) => (
                  <tr key={v.numeroplaca} className="hover:bg-indigo-50/20 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.numeroplaca}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{v.tipotransporte}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* Formatear la vigencia si es necesario, por ahora solo el texto */}
                      <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 font-medium">
                        {v.vigencia}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Button
                        variant={v.activo ? "default" : "destructive"}
                        size="sm"
                        onClick={() => toggleActivo(v.numeroplaca, !v.activo)}
                        className={`transition-colors duration-200 ${v.activo ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {v.activo ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                        {v.activo ? "Activo" : "Inactivo"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

     

      </div>
         {/* Columna del Formulario de Registro (Ocupa el espacio restante) */}
        <div >
          <RegisterPlaca />
        </div>
    </div>
  );
}