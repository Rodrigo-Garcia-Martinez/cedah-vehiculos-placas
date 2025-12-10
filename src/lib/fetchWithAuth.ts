// Helper para hacer fetch con autenticación automática

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('auth_token');
  
  console.log('🔍 fetchWithAuth - URL:', url);
  console.log('🔍 fetchWithAuth - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  
  if (!token) {
    console.log('❌ No hay token en sessionStorage');
  }
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('✅ Header Authorization agregado');
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}