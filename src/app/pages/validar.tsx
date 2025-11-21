"use client";
import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ValidePage() {
  const [placa, setPlaca] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const res = await fetch(`/api/placas/validate?placa=${encodeURIComponent(placa)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al validar placa");
        return;
      }

      setResultado(data);
    } catch (err) {
      setError("Error de conexión. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Search className="w-8 h-8" />
              Validar Placa Vehicular
            </h1>
            <p className="mt-2 text-blue-100">Consulta el registro de una placa en el sistema</p>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Placa
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC-123-XYZ"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                  required
                />
                <button
                  onClick={handleValidate}
                  disabled={loading || !placa}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  {loading ? "Buscando..." : "Validar"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-lg flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-bold mb-1">Error</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {resultado && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg overflow-hidden">
                <div className="bg-green-100 px-5 py-3 border-b border-green-200">
                  <h3 className="font-bold text-green-900 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Placa encontrada en el sistema
                  </h3>
                </div>
                <dl className="px-5 py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-green-200">
                    <dt className="font-semibold text-gray-700 mb-1 sm:mb-0">Número de Placa:</dt>
                    <dd className="text-gray-900 font-mono text-lg">{resultado.numeroplaca}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-green-200">
                    <dt className="font-semibold text-gray-700 mb-1 sm:mb-0">Tipo de Transporte:</dt>
                    <dd className="text-gray-900">{resultado.tipotransporte}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-green-200">
                    <dt className="font-semibold text-gray-700 mb-1 sm:mb-0">Vigencia:</dt>
                    <dd className="text-gray-900">{new Date(resultado.vigencia).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                    <dt className="font-semibold text-gray-700 mb-1 sm:mb-0">Estado:</dt>
                    <dd>
                      <span className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        resultado.activo 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {resultado.activo ? '✓ Activa' : '✗ Inactiva'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}