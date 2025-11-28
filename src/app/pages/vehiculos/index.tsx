// pages/vehiculos/index.tsx
import { getSession } from 'next-auth/react';
import NavBar from '@/components/NavBar';

export default function VehiculosPage({ session, data }: any) {
    return (
        <div>
            <NavBar />
            <main className="p-4">
                <h1 className="text-2xl font-semibold">Vehículos</h1>
                <p>Contenido protegido, usuario: {session?.user?.name}</p>
                {/* tu UI */}
            </main>
        </div>
    );
}


export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }


    // ejemplo: traer datos de vehiculos si quieres
    // const res = await fetchSomeDataUsingServerSide();


    return {
        props: {
            session,
            // data: res ?? null,
        },
    };
}