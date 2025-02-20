"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuthCookie, removeAuthCookie } from "../utils/cookies";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // Importar signOut de NextAuth
import { useRol } from "../context/RolContext"; // Importar contexto de rol

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { rolSimulado, cambiarRol } = useRol(); // Usar el contexto de rol

  // Verificar autenticación solo en el cliente
  useEffect(() => {
    setIsAuthenticated(!!getAuthCookie());
  }, []);

  // Función para manejar el logout
  const handleLogout = async () => {
    // Eliminar la cookie del JWT
    removeAuthCookie();

    // Cerrar la sesión de Google con NextAuth
    await signOut({ redirect: false });
    cambiarRol("none");
    // Redirigir al login
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const rutasPorRol: Record<string, { path: string; label: string }[]> = {
    admin: [
      { path: "/roles", label: "Gestión de Roles" },
      { path: "/infraestructura", label: "Gestión de Infraestructura" },
      { path: "/edificios", label: "Gestión de Edificios" },
      { path: "/account", label: "Cuenta" },
    ],
    coord: [
      { path: "/infraestructura", label: "Gestión de Sede" },
      { path: "/edificios", label: "Gestión de Edificios" },
      { path: "/account", label: "Cuenta" },
    ],
    maint: [
      { path: "/infraestructura", label: "Información Sede" },
      { path: "/edificios", label: "Información edificios" },
      { path: "/account", label: "Cuenta" },
    ],
    user: [
      { path: "/infraestructura", label: "Buscador de edificios" },
      { path: "/edificios", label: "Edificios" },
      { path: "/account", label: "Cuenta" },
    ],
    none: [],
  };

  const rutas = rutasPorRol[rolSimulado] || [];

  return (
    <header className="bg-[#1f6032] text-white p-4 flex justify-between items-center relative">
      {/* Contenedor del logo */}
      <div className="flex justify-center items-center w-1/3">
        <Link href="/">
          <img
            src="/images/Guayaba_LogoTexto.png"
            alt="Guayaba Logo"
            className="w-48 h-auto cursor-pointer"
          />
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex justify-end">
        {/* Botón hamburguesa visible solo en pantallas pequeñas */}
        <button className="block md:hidden text-white" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </nav>

      {/* Menú en pantallas grandes: horizontal, siempre visible */}
      <ul className="hidden md:flex md:flex-row md:space-x-6 items-center">
        {isAuthenticated ? (
          <>
            <li className="relative group">
              <button className="hover:text-gray-300 transition-colors flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                  ></path>
                </svg>
                Navegación por la aplicación
              </button>
              <ul className="absolute hidden group-hover:block bg-[#1f6032] text-white p-2 space-y-2">
                {rutas.map((ruta) => (
                  <li key={ruta.path}>
                    <Link
                      href={ruta.path}
                      className="hover:text-gray-300 transition-colors flex items-center"
                    >
                      {ruta.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/login"
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14M12 5l7 7-7 7"
                ></path>
              </svg>
              Iniciar Sesión
            </Link>
          </li>
        )}

        <li>
          <Link
            href="/contact"
            className="hover:text-gray-300 transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18"
              ></path>
            </svg>
            Contacto
          </Link>
        </li>
        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 6h-6"
                ></path>
              </svg>
              Cerrar Sesión
            </button>
          </li>
        )}
      </ul>

      {/* Menú desplegable para pantallas pequeñas */}
      <div
        className={`md:hidden absolute top-full right-0 w-48 bg-emerald-800 text-white p-4 space-y-4 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul>
          {isAuthenticated ? (
            <>
              {rutas.map((ruta) => (
                <li key={ruta.path}>
                  <Link
                    href={ruta.path}
                    className="hover:text-gray-300 transition-colors flex items-center"
                  >
                    {ruta.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 6h-6"
                    ></path>
                  </svg>
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="hover:text-gray-300 transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                  ></path>
                </svg>
                Iniciar Sesión
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/contact"
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18"
                ></path>
              </svg>
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;