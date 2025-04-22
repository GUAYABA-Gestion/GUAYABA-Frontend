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
    "/espacios",
    "/reportes",
    "/roles",
    "/historial",
    "/infraestructura/informe",
    //"/informe",
  ];

  // No redirigir si la ruta es /login o /register
  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // Verificar si la ruta solicitada está protegida
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // Redirige al login con callbackUrl para retornar después de iniciar sesión
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", "middleware"); // Guarda la ruta original con parámetros
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search); // Guarda la ruta original con parámetros
    return NextResponse.redirect(loginUrl);
  }

  // Permite continuar si está autenticado
  return NextResponse.next();
}

// Configuración para aplicar el middleware en las rutas protegidas
export const config = {
  matcher: ["/roles", "/account","/historial", "/sedes", "/infraestructura", "/espacios", "/mantenimiento", "/reportes", "/infraestructura/informe", "/informe"], // Rutas protegidas
};