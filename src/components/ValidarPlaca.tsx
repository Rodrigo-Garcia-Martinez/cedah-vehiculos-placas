'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  AlertCircle,
  CarFront,
  ShieldCheck,
  Search,
  SlidersHorizontal
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
    numeroPlaca: string;
    tipotransporte: string;
    vigencia: string;
  };
  message?: string;
}

/* Tipos mínimos FriendlyCaptcha (sin any) */
type CaptchaWidget = {
  destroy: () => void;
};

type CaptchaSDK = {
  createWidget: (options: {
    element: HTMLElement;
    sitekey: string;
    startMode?: 'manual' | 'auto';
    language?: string;
  }) => CaptchaWidget;
};

export default function ValidarPlaca() {
  const [numeroPlaca, setnumeroPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaStarted, setCaptchaStarted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [tipoBusqueda, setTipoBusqueda] = useState<'placa' | 'serie'>('placa');

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetRef = useRef<CaptchaWidget | null>(null);
  const captchaSdkRef = useRef<CaptchaSDK | null>(null);

  /* =========================
     CREAR CAPTCHA (SOLO AL DAR CLICK)
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!captchaStarted || !captchaContainerRef.current) return;

    // 🔴 CLAVE: si hay widget, NO creamos otro
    if (captchaWidgetRef.current) return;

    if (!captchaSdkRef.current) {
      captchaSdkRef.current =
        new FriendlyCaptchaSDK({
          apiEndpoint: 'global'
        }) as unknown as CaptchaSDK;
    }

    captchaWidgetRef.current =
      captchaSdkRef.current.createWidget({
        element: captchaContainerRef.current,
        sitekey: SITE_KEY,
        startMode: 'manual',
        language: 'en'
      });

    const handleSolved = (e: Event) => {
      const custom = e as CustomEvent<{ response: string }>;
      setCaptchaToken(custom.detail.response);
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
    };
  }, [captchaStarted]);

  /* =========================
     SUBMIT
  ========================= */
  const handleValidate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!numeroPlaca || !captchaToken) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroPlaca,
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
      // ❗ NO tocamos captcha aquí
    }
  };

  const resetCaptchaAndResult = () => {
    setResult(null);

    // 🔑 DESTRUIMOS EL WIDGET
    if (captchaWidgetRef.current) {
      captchaWidgetRef.current.destroy();
      captchaWidgetRef.current = null;
    }

    setCaptchaToken(null);
    setCaptchaStarted(false);
    setShowCaptcha(false);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* HEADER */}

        <form onSubmit={handleValidate} className="space-y-4">
          {/* SELECT: Placa / Serie */}
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center">
              <SlidersHorizontal className="text-white w-6 h-6" />
            </div>

            <select
              value={tipoBusqueda}
              onChange={(e) => {
                const value = e.target.value as 'placa' | 'serie';
                setTipoBusqueda(value);
                setnumeroPlaca('');
                resetCaptchaAndResult();
              }}
              className="flex-1 px-6 outline-none font-semibold bg-white"
            >
              <option value="placa">Placa</option>
              <option value="serie">Serie</option>
            </select>
          </div>

          {/* INPUT */}
          <div className="flex shadow-md rounded-md overflow-hidden h-14 border bg-white">
            <div className="bg-[#691C32] w-16 flex items-center justify-center">
              <CarFront className="text-white w-6 h-6" />
            </div>

            <input
              value={numeroPlaca}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setnumeroPlaca(value);
                setResult(null);

                // 🔑 AQUÍ SÍ DESTRUIMOS EL WIDGET
                if (captchaWidgetRef.current) {
                  captchaWidgetRef.current.destroy();
                  captchaWidgetRef.current = null;
                }

                setCaptchaToken(null);
                setCaptchaStarted(false);
                setShowCaptcha(value.length >= 5);
              }}
              placeholder={
                tipoBusqueda === 'placa'
                  ? 'INGRESE NÚMERO DE PLACA (EJ:58AP1G)'
                  : 'INGRESE NÚMERO DE SERIE (VIN)'
              }
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
                <p className="font-semibold">
                  Anti-Robot Verification
                </p>
                <p className="text-sm text-gray-600">
                  Click to start verification
                </p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                FriendlyCaptcha ↗
              </span>
            </div>
          )}

          {/* CAPTCHA REAL */}
          {captchaStarted && (
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

        {/* RESULTADO */}
        {result && (
          <>
            {result && result.found && result.vehiculo && (
              <div className="border border-green-600 rounded-xl overflow-hidden max-w-md mx-auto shadow-sm">
                {/* HEADER */}
                <div className="bg-green-600 text-white px-4 py-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="font-semibold text-base sm:text-lg leading-tight">
                    Validación Exitosa – Placa Registrada en CNE
                  </span>
                </div>

                {/* BODY */}
                <div className="bg-white p-5 sm:p-6 space-y-4 text-gray-900">
                  {/* DATOS */}
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base">
                      <strong>Placa:</strong>{' '}
                      <span className="break-words">
                        {result.vehiculo.numeroPlaca}
                      </span>
                    </p>

                    <p className="text-sm sm:text-base">
                      <strong>Tipo:</strong>{' '}
                      <span className="break-words">
                        {result.vehiculo.tipotransporte}
                      </span>
                    </p>

                    <p className="text-sm sm:text-base">
                      <strong>Vigencia:</strong>{' '}
                      {new Date(result.vehiculo.vigencia)
                        .toISOString()
                        .split('T')[0]}
                    </p>
                  </div>

                  {/* ESTATUS */}
                  <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                    {/* ÍCONO */}
                    <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* TEXTO */}
                    <span className="text-green-700 font-bold text-lg sm:text-xl md:text-2xl">
                      AUTORIZADO
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
