import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  // Ruta protegida
  const isProtectedRoute = req.nextUrl.pathname === "/account";

  if (isProtectedRoute && !token) {
    // Redirige al login con callbackUrl para retornar después de iniciar sesión
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Permite continuar si está autenticado
  return NextResponse.next();
}

// Configuración para aplicar el middleware solo en "/"
export const config = {
  matcher: ["/account"], // Ruta protegida
};
