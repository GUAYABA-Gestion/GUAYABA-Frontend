import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt"); // Obtener el JWT de las cookies

  // Lista de rutas protegidas
  const protectedRoutes = [
    "/account",
    "/sedes",
    "/mantenimiento",
    "/infraestructura",
    "/reportes",
    "roles",
  ];

  // Verificar si la ruta solicitada está protegida
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);

  if (isProtectedRoute && !token) {
    // Redirige al login con callbackUrl para retornar después de iniciar sesión
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // Guarda la ruta original
    return NextResponse.redirect(loginUrl);
  }

  // Permite continuar si está autenticado
  return NextResponse.next();
}

// Configuración para aplicar el middleware en las rutas protegidas
export const config = {
  matcher: ["/account", "/sedes", "/infraestructura","/mantenimiento", "/reportes"], // Rutas protegidas
};