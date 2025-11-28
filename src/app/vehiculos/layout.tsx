import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function VehiculosLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 🔐 Validación de sesión en servidor
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <NavBar />
      <main className="p-4">{children}</main>
    </>
  );
}
