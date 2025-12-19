'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, CarFront } from 'lucide-react';
import { FriendlyCaptchaSDK } from '@friendlycaptcha/sdk';

/* =========================
   CONFIGURACIÓN CAPTCHA
========================= */
const SITE_KEY = 'FCMH682ENJIB14E2'; // 👈 DEBE empezar con pk_

const sdk = new FriendlyCaptchaSDK({ apiEndpoint: 'global' });

/* =========================
   TIPOS
========================= */
interface ValidationResult {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
  };
  message?: string;
}

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export default function ValidarPlaca() {
  const [numeroplaca, setNumeroPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetRef = useRef<any>(null);

  /* =========================
     INICIALIZAR CAPTCHA
  ========================= */
  useEffect(() => {
    if (!showCaptcha || !captchaContainerRef.current) return;
    if (captchaWidgetRef.current) return; // evita doble render (StrictMode)

    captchaWidgetRef.current = sdk.createWidget({
      element: captchaContainerRef.current,
      sitekey: SITE_KEY
    });

    const handleSolved = (e: any) => {
      setCaptchaToken(e.detail.response);
    };

    captchaContainerRef.current.addEventListener(
      'frc:widget.complete',
      handleSolved
    );

    return () => {
      captchaContainerRef.current?.removeEventListener(
        'frc:widget.complete',
        handleSolved
      );
      captchaWidgetRef.current?.destroy();
      captchaWidgetRef.current = null;
    };
  }, [showCaptcha]);

  /* =========================
     SUBMIT
  ========================= */
  const handleValidate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!numeroplaca || !captchaToken) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroplaca,
          captcha: captchaToken
        })
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        message: 'Error al conectar con el servidor'
      });
    } finally {
      setLoading(false);
      if (captchaWidgetRef.current) {
        captchaWidgetRef.current.reset();
      }
      setCaptchaToken(null);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">

        <form onSubmit={handleValidate} className="space-y-4">

          {/* INPUT PLACA */}
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border border-gray-200 bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center">
              <CarFront className="text-white w-6 h-6" />
            </div>

            <input
              type="text"
              value={numeroplaca}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setNumeroPlaca(value);

                if (value.trim().length >= 5) {
                  setShowCaptcha(true);
                } else {
                  setShowCaptcha(false);
                  setCaptchaToken(null);
                }
              }}
              placeholder="INGRESE NÚMERO DE PLACA (EJ: 58AP1G)"
              className="flex-1 px-6 text-gray-600 placeholder-gray-400 outline-none font-semibold uppercase text-sm tracking-wide"
              disabled={loading}
            />
          </div>

          {/* CAPTCHA */}
          {showCaptcha && (
            <div className="flex justify-center mt-4">
              <div ref={captchaContainerRef} />
            </div>
          )}

          {/* BOTÓN VALIDAR (solo aparece si captcha es correcto) */}
          {captchaToken && (
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md hover:bg-[#691C32] disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
                {loading ? 'Validando...' : 'Validar'}
              </button>
            </div>
          )}

        </form>

        {/* RESULTADO */}
        {result && (
          <div className="mt-6 animate-fade-in">

            {result.found && result.vehiculo ? (
              <div className="border border-green-700 rounded-lg overflow-hidden">
                <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold text-lg">
                    Validación Exitosa - Placa Registrada en CNE
                  </span>
                </div>

                <div className="bg-white p-6 space-y-2">
                  <p><strong>Placa:</strong> {result.vehiculo.numeroplaca}</p>
                  <p><strong>Tipo Transporte:</strong> {result.vehiculo.tipotransporte}</p>
                  <p>
                    <strong>Vigencia:</strong>{' '}
                    {result.vehiculo.vigencia.split('T')[0]}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-200 border-2 border-red-300 rounded-lg p-3 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-900" />
                <span className="font-bold text-yellow-900">
                  Error: Datos de placa no registrados en CNE
                </span>
              </div>
            )}

          </div>
        )}

      </CardContent>
    </Card>
  );
}
