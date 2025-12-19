'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, CarFront, ShieldCheck } from 'lucide-react';
import { FriendlyCaptchaSDK } from '@friendlycaptcha/sdk';

/* =========================
   CONFIGURACIÓN CAPTCHA
========================= */
const SITE_KEY = 'FCMH682ENJIB14E2'; // 👈 DEBE empezar con pk_

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
  const [captchaStarted, setCaptchaStarted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetRef = useRef<any>(null);
  const captchaSdkRef = useRef<any>(null); // 👈 SDK SOLO EN CLIENTE

  /* =========================
     INICIALIZAR CAPTCHA
  ========================= */
  useEffect(() => {
    // 🚨 Esto garantiza que solo corre en el navegador
    if (typeof window === 'undefined') return;
    if (!showCaptcha || !captchaStarted || !captchaContainerRef.current) return;
    if (captchaWidgetRef.current) return;

    // Crear SDK SOLO aquí
    if (!captchaSdkRef.current) {
      captchaSdkRef.current = new FriendlyCaptchaSDK({
        apiEndpoint: 'global'
      });
    }

    captchaWidgetRef.current =
    captchaSdkRef.current.createWidget({
    element: captchaContainerRef.current,
    sitekey: SITE_KEY,
    startMode: 'auto' // 👈 clave
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
  }, [showCaptcha, captchaStarted]);

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
      setCaptchaStarted(false);
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
                  setCaptchaStarted(false);
                  setCaptchaToken(null);
                }
              }}
              placeholder="INGRESE NÚMERO DE PLACA (EJ: 58AP1G)"
              className="flex-1 px-6 text-gray-600 placeholder-gray-400 outline-none font-semibold uppercase text-sm tracking-wide"
              disabled={loading}
            />
          </div>

          {/* TARJETA CLICK TO START */}
          {showCaptcha && !captchaStarted && (
            <div
              onClick={() => setCaptchaStarted(true)}
              className="cursor-pointer border border-gray-300 rounded-md p-4 flex items-center gap-4 bg-white hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-gray-700" />
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  Anti-Robot Verification
                </span>
                <span className="text-sm text-gray-600">
                  Click to start verification
                </span>
              </div>

              <span className="ml-auto text-xs text-gray-400">
                FriendlyCaptcha ↗
              </span>
            </div>
          )}

          {/* CAPTCHA REAL */}
          {showCaptcha && captchaStarted && (
            <div className="flex justify-center mt-4">
              <div ref={captchaContainerRef} />
            </div>
          )}

          {/* BOTÓN VALIDAR */}
          {captchaToken && (
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md hover:bg-[#691C32] disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
              >
                {loading ? 'Validando...' : 'Validar'}
              </button>
            </div>
          )}

        </form>

        {/* RESULTADO */}
        {result && (
          <div className="mt-6">
            {result.found ? (
              <div className="bg-green-200 p-4 rounded flex gap-2">
                <CheckCircle /> Placa válida
              </div>
            ) : (
              <div className="bg-red-200 p-4 rounded flex gap-2">
                <AlertCircle /> Placa no encontrada
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
