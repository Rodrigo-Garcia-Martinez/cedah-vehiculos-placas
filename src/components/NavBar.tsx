// components/NavBar.tsx
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <header className="w-full flex justify-end p-4">
      {session?.user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">{session.user.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm underline"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div />
      )}
    </header>
  );
}
