import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "tu-secreto-super-seguro"
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Solo validar rutas de API, no páginas HTML
  const isApiRoute = path.startsWith('/api/');
  
  if (!isApiRoute) {
    // Dejar pasar todas las páginas (vehiculos, login, etc.)
    // La protección se hace en el cliente con useSessionAuth
    console.log('✅ Permitiendo acceso a página:', path);
    return NextResponse.next();
  }

  // 🔐 Para APIs, buscar token en header Authorization
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // Permitir acceso a endpoints públicos sin token
const publicEndpoints = ['/api/auth/', '/api/validar', '/api/health', '/api/db-check'];
if (publicEndpoints.some(endpoint => path.startsWith(endpoint))) {
  const res = NextResponse.next();
  res.headers.set('x-mw-public', '1');
  res.headers.set('x-mw-path', path);
  return res;
}


  console.log('🔍 Validando API:', {
    path,
    hasToken: !!token,
  });

  // Verificar si el token es válido para otras APIs protegidas
  if (!token) {
    console.log('❌ Token no encontrado en API');
    return NextResponse.json(
      { error: 'No autorizado - Token requerido' },
      { status: 401 }
    );
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    console.log('✅ Token válido para API');
    return NextResponse.next();
  } catch (error) {
    console.log('❌ Token inválido:', error);
    return NextResponse.json(
      { error: 'No autorizado - Token inválido' },
      { status: 401 }
    );
  }
}

export const config = {
  // Solo interceptar rutas de API y páginas protegidas
  matcher: [
    '/api/:path*',
    '/vehiculos/:path*',
  ],
};