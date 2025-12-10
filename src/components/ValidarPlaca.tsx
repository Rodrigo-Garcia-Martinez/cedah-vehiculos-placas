'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, XCircle, AlertCircle, Calendar, Car, CarFront } from 'lucide-react';

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
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroplaca: numeroplaca})
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
                
              </div>
              <div className="flex justify-center">
  <button
    type="submit"
    disabled={loading || !numeroplaca.trim()}
    className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md hover:bg-[#691C32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
  >
    <div className="frc-captcha" data-sitekey="A1SVA4PDN3VIVGTFFO28MB07H034RLBME5VOS8EIFN9VSU9266QCOMPGDG"></div>
    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
    </svg>

    {loading ? 'Validando...' : 'Validar'}
  </button>
</div>

              
          </form>

          {result && (
            <div className="mt-6 animate-fade-in">
              {result.found && result.vehiculo ? (
                <div className={`border-2 rounded-lg p-6 ${
                  result.vehiculo.esVigente 
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
                      <h4 className={`text-lg font-bold ${
                        result.vehiculo.esVigente ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {result.vehiculo.esVigente ? 'Validación Exitosa - Placa Registrada en CNE' : 'Placa Vencida'}
                      </h4>
                    </div>
                  </div>
<div className="border border-green-600 rounded-lg overflow-hidden">

  {/* ENCABEZADO VERDE */}
  <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
    <svg
      className="w-6 h-6 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>

    <span className="font-semibold text-lg">
      Validación Exitosa - Placa Registrada en CNE
    </span>
  </div>

  {/* CONTENIDO */}
  <div className="bg-white p-5 space-y-3">

    <div className="flex items-center gap-2">
      <Car className="w-5 h-5 text-gray-700" />
      <span className="font-semibold text-gray-800">Placa:</span>
      <span className="text-gray-900 font-mono">{result.vehiculo.numeroplaca}</span>
    </div>

    <div className="flex items-center gap-2">
      <Car className="w-5 h-5 text-gray-700" />
      <span className="font-semibold text-gray-800">Tipo Transporte:</span>
      <span className="text-gray-900">{result.vehiculo.tipotransporte}</span>
    </div>

    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5 text-gray-700" />
      <span className="font-semibold text-gray-800">Vigencia:</span>
      <span className="text-gray-900">
        {new Date(result.vehiculo.vigencia).toISOString().split('T')[0]}
      </span>
    </div>

    {/* Estatus Actual */}
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 text-green-700 font-semibold text-lg">
        <svg
          className="w-6 h-6 text-green-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        AUTORIZADO
      </div>
    </div>
  </div>
</div>

                </div>
              ) : (
                <div className="bg-red-200 border-2 border-red-300 rounded-lg p-1">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-8 h-8 text-yellow-900 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-yellow-900">
                        Error: Datos de placa no registrados en CNE
                      </h4>
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