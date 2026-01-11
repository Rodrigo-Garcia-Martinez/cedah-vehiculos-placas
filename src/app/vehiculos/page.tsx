'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegisterPlaca from "@/components/RegisterPlaca";
import { Check, X, Truck, LogOut } from "lucide-react";
import { useSessionAuth } from "@/hooks/useSessionAuth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Vehiculo {
  numeroPlaca: string;
  tipoTransporte: string;
  vigencia: string;
  activo: boolean;
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useSessionAuth();

  // 🔒 Redirigir INMEDIATAMENTE si no hay sesión (sin mostrar loading)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login"); // replace en vez de push para no agregar al historial
    }
  }, [authLoading, isAuthenticated, router]);

  // Si no hay sesión, no renderizar nada (evita el flash de "Cargando")
  if (!authLoading && !isAuthenticated) {
    return null;
  }

  const cargarVehiculos = async () => {
    try {
      const res = await fetchWithAuth("/api/vehiculos");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setVehiculos(data);
    } catch (err) {
      console.error("Error cargando vehículos", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivo = async (numeroPlaca: string, nuevoEstado: boolean) => {
    try {
      await fetchWithAuth("/api/estado", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroPlaca, activo: nuevoEstado }),
      });

      cargarVehiculos();
    } catch (err) {
      console.error("Error al actualizar estado", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      cargarVehiculos();
    }
  }, [isAuthenticated]);

  // Mostrar loading mientras se verifica autenticación
  if (authLoading || loading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Cargando vehículos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header con botón de logout */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <Truck className="w-7 h-7 text-indigo-600" />
          Gestión de Vehículos
        </h1>
        
    
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna de la Tabla */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Listado de Placas Registradas
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tipo Transporte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Vigencia
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {vehiculos.map((v) => (
                    <tr
                      key={v.numeroPlaca}
                      className="hover:bg-indigo-50/20 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {v.numeroPlaca}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {v.tipotransporte}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge
                          variant="outline"
                          className="text-indigo-600 border-indigo-200 bg-indigo-50 font-medium"
                        >
                          {v.vigencia}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Button
                          variant={v.activo ? "default" : "destructive"}
                          size="sm"
                          onClick={() => toggleActivo(v.numeroPlaca, !v.activo)}
                          className={`transition-colors duration-200 ${
                            v.activo
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {v.activo ? (
                            <Check className="w-4 h-4 mr-1" />
                          ) : (
                            <X className="w-4 h-4 mr-1" />
                          )}
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
      </div>

      {/* Formulario de Registro */}
      <div className="mt-8">
        <RegisterPlaca onRegistrationSuccess={cargarVehiculos} />
      </div>
    </div>
  );
}