'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  AlertCircle,
  CarFront,
  ShieldCheck
} from 'lucide-react';
import { FriendlyCaptchaSDK } from '@friendlycaptcha/sdk';

/* =========================
   CONFIGURACIÓN CAPTCHA
========================= */
const SITE_KEY = 'FCMH682ENJIB14E2';

/* =========================
   TIPOS
========================= */
interface ValidationResult {
  found: boolean;
  vehiculo?: {
    numeroplaca: string;
    tipotransporte: string;
    vigencia: string;
    activo?: boolean;
    esVigente?: boolean;
    diasRestantes?: number;
  };
  message?: string;
}

/* =========================
   COMPONENTE
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
  const captchaSdkRef = useRef<any>(null);

  /* =========================
     CAPTCHA
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!showCaptcha || !captchaStarted || !captchaContainerRef.current) return;
    if (captchaWidgetRef.current) return;

    if (!captchaSdkRef.current) {
      captchaSdkRef.current = new FriendlyCaptchaSDK({
        apiEndpoint: 'global'
      });
    }

    captchaWidgetRef.current =
      captchaSdkRef.current.createWidget({
        element: captchaContainerRef.current,
        sitekey: SITE_KEY,
        startMode: 'auto'
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
      setCaptchaStarted(false);
      setCaptchaToken(null);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 space-y-6">

        {/* FORM */}
        <form onSubmit={handleValidate} className="space-y-4">

          {/* INPUT */}
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center">
              <CarFront className="text-white w-6 h-6" />
            </div>

            <input
              value={numeroplaca}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setNumeroPlaca(value);
                setResult(null);

                if (value.length >= 5) {
                  setShowCaptcha(true);
                } else {
                  setShowCaptcha(false);
                  setCaptchaStarted(false);
                  setCaptchaToken(null);
                }
              }}
              placeholder="INGRESE NÚMERO DE PLACA"
              className="flex-1 px-6 outline-none font-semibold"
            />
          </div>

          {/* CLICK TO START */}
          {showCaptcha && !captchaStarted && (
            <div
              onClick={() => setCaptchaStarted(true)}
              className="cursor-pointer border rounded-md p-4 flex items-center gap-4 hover:bg-gray-50"
            >
              <ShieldCheck className="w-8 h-8 text-gray-700" />
              <div>
                <p className="font-semibold">Anti-Robot Verification</p>
                <p className="text-sm text-gray-600">
                  Click to start verification
                </p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                FriendlyCaptcha ↗
              </span>
            </div>
          )}

          {/* CAPTCHA */}
          {showCaptcha && captchaStarted && (
            <div className="flex justify-center">
              <div ref={captchaContainerRef} />
            </div>
          )}

          {/* BOTÓN */}
          {captchaToken && (
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#8B2C4A] text-white rounded-md"
              >
                {loading ? 'Validando...' : 'Validar'}
              </button>
            </div>
          )}
        </form>

        {/* RESULTADOS */}
        {result && (
          <>
            {result.found && result.vehiculo ? (
              <div className="border border-green-600 rounded-lg overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-3 flex gap-2 items-center">
                  <CheckCircle />
                  <span className="font-semibold">
                    Validación Exitosa - Placa Registrada en CNE
                  </span>
                </div>

                <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p><strong>Placa:</strong> {result.vehiculo.numeroplaca}</p>
                  <p><strong>Tipo:</strong> {result.vehiculo.tipotransporte}</p>
                  <p><strong>Vigencia:</strong>{' '} {result.vehiculo.vigencia}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-200 border border-red-300 rounded p-4 flex gap-2">
                <AlertCircle />
                <span>
                  {result.message ||
                    'Datos de placa no encontrados'}
                </span>
              </div>
            )}
          </>
        )}

      </CardContent>
    </Card>
  );
}
