"use client";

import Link from "next/link";
import { useRol } from "../context/RolContext";

const Navbar = () => {
  const { rolSimulado } = useRol();

  const rutasPorRol: Record<string, { path: string; label: string }[]> = {
    admin: [
      { path: "/roles", label: "Gestión de Roles" },
      { path: "/infraestructura", label: "Gestión de Infraestructura" },
      { path: "/edificios", label: "Gestión de Edificios" },
      { path: "/espacios", label: "Gestión de Espacios" },
      { path: "/mantenimiento", label: "Gestión de Mantenimientos" },
      { path: "/eventos", label: "Gestión de Eventos" },
      { path: "/dashboard", label: "Dashboard" },
    ],
    coord: [
      { path: "/sedes", label: "Gestión de Sede" },
      { path: "/infraestructura", label: "Gestión de Infraestructura" },
      { path: "/espacios", label: "Gestión de Espacios" },
      { path: "/mantenimiento", label: "Gestión de Mantenimientos" },
      { path: "/eventos", label: "Gestión de Eventos" },
    ],
    maint: [
      { path: "/edificios", label: "Gestión de Edificios" },
      { path: "/espacios", label: "Gestión de Espacios" },
      { path: "/mantenimiento", label: "Gestión de Mantenimientos" },
      { path: "/eventos", label: "Gestión de Eventos" },
    ],
    user: [
      { path: "/edificios", label: "Edificios" },
      { path: "/espacios", label: "Espacios" },
      { path: "/eventos", label: "Eventos" },
    ],
    none: [],
  };

  const rutas = rutasPorRol[rolSimulado] || [];

  return (
    <nav className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col sticky top-0 left-0">
      {/* Encabezado con Guayaba App y Rol Actual */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Guayaba App</h1>
        <p className="text-sm mt-1">
          Rol actual: <span className="font-medium">{rolSimulado}</span>
        </p>
      </div>
  
      {/* Navegación */}
      <ul className="space-y-4 flex-1">
        {rutas.map((ruta) => (
          <li key={ruta.path}>
            <Link href={ruta.path}>
              <span className="block p-2 rounded hover:bg-gray-700">
                {ruta.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
