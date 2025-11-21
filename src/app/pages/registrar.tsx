"use client";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    numeroPlaca: "",
    tipoTransporte: "",
    vigencia: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/placas/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Error al registrar placa" });
        return;
      }

      setMessage({ type: "success", text: "¡Placa registrada exitosamente!" });
      setFormData({ numeroPlaca: "", tipoTransporte: "", vigencia: "" });
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión. Por favor, intente nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Save className="w-8 h-8" />
              Registrar Nueva Placa
            </h1>
            <p className="mt-2 text-green-100">Complete el formulario para registrar una placa vehicular</p>
          </div>

          <div className="p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Placa *
                </label>
                <input
                  type="text"
                  value={formData.numeroPlaca}
                  onChange={(e) => setFormData({...formData, numeroPlaca: e.target.value.toUpperCase()})}
                  placeholder="Ej: ABC-123-XYZ"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-mono"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Formato: letras, números y guiones</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Transporte *
                </label>
                <select
                  value={formData.tipoTransporte}
                  onChange={(e) => setFormData({...formData, tipoTransporte: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  required
                >
                  <option value="">Seleccione un tipo...</option>
                  <option value="Camión">Camión</option>
                  <option value="Camioneta">Camioneta</option>
                  <option value="Tractocamión">Tractocamión</option>
                  <option value="Remolque">Remolque</option>
                  <option value="Semirremolque">Semirremolque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Vigencia *
                </label>
                <input
                  type="date"
                  value={formData.vigencia}
                  onChange={(e) => setFormData({...formData, vigencia: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Fecha hasta la cual la placa es válida</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.numeroPlaca || !formData.tipoTransporte || !formData.vigencia}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                {loading ? "Registrando..." : "Registrar Placa"}
              </button>
            </div>

            {message.text && (
              <div className={`mt-6 px-5 py-4 rounded-lg border-l-4 ${
                message.type === "success" 
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-red-50 border-red-500 text-red-800"
              }`}>
                <div className="flex items-start gap-3">
                  {message.type === "success" ? (
                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div>
                    <h3 className="font-bold mb-1">
                      {message.type === "success" ? "Éxito" : "Error"}
                    </h3>
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}