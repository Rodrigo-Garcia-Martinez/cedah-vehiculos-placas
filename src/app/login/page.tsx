
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     const res = await signIn("credentials", {
//       redirect: false,
//       email,
//       password,
//     });
//     if (res?.error) {
//       setError("Credenciales inválidas");
//       return;
//     }
//     // redirigir a /vehiculos
//     router.push("/vehiculos");
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="rounded-2xl shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm">Email</label>
//               <input
//                 className="w-full border rounded px-3 py-2"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm">Contraseña</label>
//               <input
//                 className="w-full border rounded px-3 py-2"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {error && <div className="text-red-600">{error}</div>}
//             <div>
//               <button className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white">
//                 Entrar
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result?.error) {
      router.push("/vehiculos"); // redirige al dashboard
    } else {
       setError("Credenciales inválidas");
       alert("Credenciales incorrectas");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Email</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm">Contraseña</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div>
              <button className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white">
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
