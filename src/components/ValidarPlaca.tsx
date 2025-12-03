'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Calendar, Car, CarFront } from 'lucide-react';

interface ValidationResult {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
    activo: boolean;
    esVigente: boolean;
    diasRestantes: number;
  };
  message?: string;
}

export default function ValidatePlaca() {
  const [numeroplaca, setNumeroPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroplaca.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // ✅ Fetch normal sin autenticación (endpoint público)
      const response = await fetch("/api/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroplaca }),
      });

      const data = await response.json();
      console.log('Respuesta de validación:', data);
      setResult(data);
    } catch (error) {
      setResult({
        found: false,
        message: 'Error al conectar con el servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleValidate} className="space-y-4">
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border border-gray-200 bg-white">
            {/* Icono lateral izquierdo */}
            <div className="bg-[#691C32] w-16 flex items-center justify-center flex-shrink-0">
              <CarFront className="text-white w-6 h-6" />
            </div>
            <input
              type="text"
              value={numeroplaca}
              onChange={(e) => setNumeroPlaca(e.target.value)}
              placeholder="INGRESE NÚMERO DE PLACA (EJ: 58AP1G)"
              className="flex-1 px-6 text-gray-600 placeholder-gray-400 outline-none font-semibold uppercase text-sm tracking-wide"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !numeroplaca.trim()}
              className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md hover:bg-[#691C32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Validando...' : 'Validar'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 animate-fade-in">
            {result.found && result.vehiculo ? (
              <div className={`border-2 rounded-lg p-6 ${result.vehiculo.esVigente
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
                }`}>
                <div className="flex items-start gap-3 mb-4">
                  {result.vehiculo.esVigente ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-lg font-bold ${result.vehiculo.esVigente ? 'text-green-900' : 'text-red-900'
                      }`}>
                      {result.vehiculo.esVigente ? 'Placa Vigente' : 'Placa Vencida'}
                    </h4>
                    <p className={`text-sm ${result.vehiculo.esVigente ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {result.vehiculo.esVigente
                        ? `Válida por ${result.vehiculo.diasRestantes} días más`
                        : 'Esta placa ha expirado'
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">Número de Placa:</span>
                    <span className="text-gray-900 font-mono">{result.vehiculo.numeroplaca}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">Tipo de Transporte:</span>
                    <span className="text-gray-900">{result.vehiculo.tipotransporte}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">Vigencia:</span>
                    <span className="text-gray-900">
                      {new Date(result.vehiculo.vigencia).toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900">
                      Placa No Encontrada
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {result.message || 'El número de placa ingresado no está registrado en el sistema'}
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      Por favor verifique el número o contáctese con el administrador.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}