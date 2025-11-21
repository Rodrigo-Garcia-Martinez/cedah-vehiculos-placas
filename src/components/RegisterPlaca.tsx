'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, CheckCircle, XCircle, Calendar, Car, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function RegisterPlaca() {
  const [formData, setFormData] = useState({
    numeroplaca: '',
    tipoTransporte: '',
    vigencia: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const tiposTransporte = [
    'Automóvil',
    'Camión',
    'Camioneta',
    'Motocicleta',
    'Autobús',
    'Taxi',
    'Carga'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroplaca: formData.numeroplaca,
          tipoTransporte: formData.tipoTransporte,
          vigencia: formData.vigencia
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
        setFormData({ numeroplaca: '', tipoTransporte: '', vigencia: '' });
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch (error) {
      setResult({ success: false, message: 'Error al conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#8B2C4A] to-[#691C32] text-white p-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Registrar Nueva Placa
          </h3>
          <p className="text-sm text-white/80 mt-2">
            Complete el formulario para registrar una nueva placa vehicular
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car className="w-4 h-4 inline mr-1" />
                Número de Placa *
              </label>
              <Input
                type="number"
                name="numeroPlaca"
                value={formData.numeroplaca}
                onChange={handleChange}
                placeholder="Ej: 12345"
                className="text-lg"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Truck className="w-4 h-4 inline mr-1" />
                Tipo de Transporte *
              </label>
              <select
                name="tipoTransporte"
                value={formData.tipoTransporte}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B2C4A] text-lg"
                required
                disabled={loading}
              >
                <option value="">Seleccione un tipo</option>
                {tiposTransporte.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Vigencia *
              </label>
              <Input
                type="date"
                name="vigencia"
                value={formData.vigencia}
                onChange={handleChange}
                min={today}
                className="text-lg"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                La fecha debe ser futura
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B2C4A] text-white rounded-md hover:bg-[#691C32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              {loading ? 'Registrando...' : 'Registrar Placa'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg border-2 animate-fade-in ${
              result.success 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <p className={`font-medium ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.message}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}