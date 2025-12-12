"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Car,
  Truck,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface RegisterPlacaProps {
  onRegistrationSuccess: () => void;
}

export default function RegisterPlaca({
  onRegistrationSuccess,
}: RegisterPlacaProps) {
  const [formData, setFormData] = useState({
    numeroplaca: "",
    tipoTransporte: "",
    vigencia: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tiposTransporte = ["VEHICULOS DE REPARTO"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setResult(null);
  };

  const handleSuccess = (message: string) => {
    setResult({ success: true, message });
    setFormData({ numeroplaca: "", tipoTransporte: "", vigencia: "" });

    // Cierra el diálogo 2 segundos después de mostrar la confirmación
    setTimeout(() => {
      setIsDialogOpen(false);
      setResult(null);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // ✅ Usar fetchWithAuth en lugar de fetch normal
      const response = await fetchWithAuth("/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroplaca: formData.numeroplaca,
          tipoTransporte: formData.tipoTransporte,
          vigencia: formData.vigencia,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onRegistrationSuccess();
        handleSuccess(data.message || "Placa registrada exitosamente.");
      } else {
        setResult({
          success: false,
          message: data.error || "Error desconocido al registrar.",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error al conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* 1. Dialog Trigger (Borde más fino) */}
      <DialogTrigger asChild>
        <Card className="mt-3 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-indigo-600 border border-dashed flex flex-col items-center justify-center space-y-2">
          <PlusCircle className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-semibold text-gray-800 text-center">
            Nuevo Registro de Placa
          </h3>
          <p className="text-xs text-gray-500 text-center">
            Haga clic para abrir el formulario de alta.
          </p>
          <Button className="mt-2 bg-[#8B2C4A] hover:bg-[#691C32] text-sm">
            Abrir Formulario
          </Button>
        </Card>
      </DialogTrigger>

      {/* 2. Dialog Content */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#8B2C4A]" />
            Registro de Vehículo
          </DialogTitle>
          <DialogDescription>
            Ingrese los datos de la nueva placa vehicular.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Campo Número de Placa */}
          <div>
            <label
              htmlFor="numeroplaca"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Car className="w-4 h-4 inline mr-1 text-gray-500" />
              Número de Placa *
            </label>
            <Input
              id="numeroplaca"
              type="text"
              name="numeroplaca"
              value={formData.numeroplaca}
              onChange={handleChange}
              placeholder="Ej: 58AP1G"
              className="text-lg uppercase tracking-wider"
              required
              disabled={loading}
            />
          </div>

          {/* Campo Tipo de Transporte */}
          <div>
            <label
              htmlFor="tipoTransporte"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Truck className="w-4 h-4 inline mr-1 text-gray-500" />
              Tipo de Transporte *
            </label>
            <select
              id="tipoTransporte"
              name="tipoTransporte"
              value={formData.tipoTransporte}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 text-lg"
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

          {/* Campo Fecha de Vigencia */}
          <div>
            <label
              htmlFor="vigencia"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Calendar className="w-4 h-4 inline mr-1 text-gray-500" />
              Fecha de Vigencia *
            </label>
            <Input
              id="vigencia"
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

          {/* Mensaje de Resultado (Success/Error) */}
          {result && (
            <div
              className={`mt-4 p-3 rounded-lg border ${
                result.success
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-red-50 border-red-400 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <p className="font-medium text-sm">{result.message}</p>
              </div>
            </div>
          )}

          {/* Footer del Diálogo */}
          <DialogFooter className="pt-4 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#8B2C4A] hover:bg-[#691C32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Registrando..." : "Confirmar Registro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}