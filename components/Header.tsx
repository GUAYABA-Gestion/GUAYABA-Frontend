"use client";
import Link from "next/link";
import { useState, useEffect, JSX } from "react";
import { getAuthCookie, removeAuthCookie } from "../utils/cookies";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // Importar signOut de NextAuth
import { useRol } from "../context/RolContext"; // Importar contexto de rol
import { FiMenu, FiLogOut, FiLogIn, FiMail, FiUser, FiGrid, FiSettings, FiArchive, FiHome, FiDollarSign } from "react-icons/fi"; // Importar iconos de react-icons

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { rolSimulado } = useRol(); // Usar el contexto de rol

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
    // Redirigir al login
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const rutasPorRol: Record<string, { path: string; label: string; icon: JSX.Element }[]> = {
    admin: [
      { path: "/roles", label: "Gestión de Roles", icon: <FiSettings className="w-5 h-5 mr-1" /> },
      { path: "/historial", label: "Auditoría", icon: <FiArchive className="w-5 h-5 mr-1" /> },
      { path: "/infraestructura", label: "Gestión de Infraestructura", icon: <FiHome className="w-5 h-5 mr-1" /> },
      { path: "/account", label: "Cuenta", icon: <FiUser className="w-5 h-5 mr-1" /> },
    ],
    coord: [
      { path: "/infraestructura", label: "Gestión de Sede", icon: <FiHome className="w-5 h-5 mr-1" /> },
      { path: "/account", label: "Cuenta", icon: <FiUser className="w-5 h-5 mr-1" /> },
    ],
    maint: [
      { path: "/infraestructura", label: "Información Sede", icon: <FiHome className="w-5 h-5 mr-1" /> },
      { path: "/account", label: "Cuenta", icon: <FiUser className="w-5 h-5 mr-1" /> },
    ],
    user: [
      { path: "/infraestructura", label: "Buscador de edificios", icon: <FiHome className="w-5 h-5 mr-1" /> },
      { path: "/account", label: "Cuenta", icon: <FiUser className="w-5 h-5 mr-1" /> },
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
          <FiMenu className="w-6 h-6" />
        </button>
      </nav>

      {/* Menú en pantallas grandes: horizontal, siempre visible */}
      <ul className="hidden md:flex md:flex-row md:space-x-6 items-center">
        {isAuthenticated ? (
          <>
            <li className="relative group">
              <button className="hover:text-gray-300 transition-colors flex items-center">
                <FiGrid className="w-5 h-5 mr-1" />
                Navegación por la aplicación
              </button>
              <ul className="absolute hidden group-hover:block bg-[#1f6032] text-white p-2 space-y-2">
                {rutas.map((ruta) => (
                  <li key={ruta.path}>
                    <Link
                      href={ruta.path}
                      className="hover:text-gray-300 transition-colors flex items-center"
                    >
                      {ruta.icon}
                      {ruta.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                href="/licensing"
                className="hover:text-gray-300 transition-colors flex items-center"
              >
                <FiDollarSign className="w-5 h-5 mr-1" />
                Consulta nuestros planes
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/login"
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <FiLogIn className="w-5 h-5 mr-1" />
              Iniciar Sesión
            </Link>
          </li>
        )}

        <li>
          <Link
            href="/contact"
            className="hover:text-gray-300 transition-colors flex items-center"
          >
            <FiMail className="w-5 h-5 mr-1" />
            Contacto
          </Link>
        </li>
        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <FiLogOut className="w-5 h-5 mr-1" />
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
                    {ruta.icon}
                    {ruta.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/licensing"
                  className="hover:text-gray-300 transition-colors flex items-center"
                >
                  <FiDollarSign className="w-5 h-5 mr-1" />
                  Consulta nuestros planes
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 transition-colors flex items-center"
                >
                  <FiLogOut className="w-5 h-5 mr-1" />
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
                <FiLogIn className="w-5 h-5 mr-1" />
                Iniciar Sesión
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/contact"
              className="hover:text-gray-300 transition-colors flex items-center"
            >
              <FiMail className="w-5 h-5 mr-1" />
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;