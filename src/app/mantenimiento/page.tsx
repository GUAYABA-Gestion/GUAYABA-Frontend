"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRol } from "../../../context/RolContext";
import { Espacio, Mantenimiento, User } from "@/types/api";
import Cookies from "js-cookie";

const GestionMantenimiento: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();

  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState<number | null>(null);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [personas, setPersonas] = useState<User[]>([]);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch personas (encargados)
  const fetchPersonas = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getAll`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
        }
      );
      if (!response.ok) throw new Error("Error obteniendo encargados");
      const data: User[] = await response.json();
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching encargados:", error);
    }
  };

  // Fetch espacios
  const fetchEspacios = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/espacio/getAll`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
        }
      );
      if (!response.ok) throw new Error("Error obteniendo espacios");
      const data: Espacio[] = await response.json();
      //console.log(data);
      setEspacios(data);
    } catch (error) {
      console.error("Error fetching espacios:", error);
    }
  };

  // Fetch mantenimientos (after fetching personas and espacios)
  const fetchMantenimientos = async () => {
    try {
      //await fetchPersonas();
      //await fetchEspacios();
      fetchPersonas();
      fetchEspacios();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mantenimiento/getAll`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
        }
      );
      if (!response.ok) throw new Error("Error obteniendo mantenimientos");
      const data: Mantenimiento[] = await response.json();
      //console.log(data);
      setMantenimientos(data);
    } catch (error) {
      console.error("Error fetching mantenimientos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers to get names from personas and espacios
  const obtenerNombreEncargado = (idEncargado: number): string => {
    const encargado = personas.find((per) => per.id_persona === idEncargado);
    return encargado ? encargado.nombre : "No asignado";
  };

  const obtenerNombreEspacio = (idEspacio: number): string => {
    try{
    const espacio = espacios.find((esp) => esp.id_espacio === idEspacio);
    return espacio ? espacio.nombre : "No asignado";
    }catch{return "No asignado";}
  };

  // Fetch data once the role is available
  useEffect(() => {

    fetchMantenimientos();
    
  },);

  if (isLoading) {
    return (
      <div className="p-4 text-gray-600">
        <h1 className="text-2xl font-bold mb-6">Cargando...</h1>
      </div>
    );
  }

  // Sorting the mantenimientos by prioridad
  const priorityOrder: Record<string, number> = {
    "Alta": 3,
    "Media": 2,
    "Baja": 1,
  };

  const sortedMantenimientos = mantenimientos.slice().sort((a, b) => {
    return (priorityOrder[b.prioridad] || 0) - (priorityOrder[a.prioridad] || 0);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Mantenimientos</h1>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Listado de Mantenimientos</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-white-100">
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Espacio</th>
                <th className="border border-gray-300 p-2">Encargado</th>
                <th className="border border-gray-300 p-2">Tipo</th>
                <th className="border border-gray-300 p-2">Estado</th>
                <th className="border border-gray-300 p-2">Prioridad</th>
                <th className="border border-gray-300 p-2">Fecha Inicio</th>
                <th className="border border-gray-300 p-2">Fecha Fin</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedMantenimientos.map((mantenimiento) => (
                <tr key={mantenimiento.id_mantenimiento}>
                  <td className="border border-gray-300 p-2 text-center">
                    {mantenimiento.id_mantenimiento}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {obtenerNombreEspacio(mantenimiento.id_espacio)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {obtenerNombreEncargado(mantenimiento.id_encargado)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {mantenimiento.tipo}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        mantenimiento.estado === "Pendiente"
                          ? "bg-yellow-200"
                          : mantenimiento.estado === "En Progreso"
                          ? "bg-blue-200"
                          : "bg-green-200"
                      }`}
                    >
                      {mantenimiento.estado}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        mantenimiento.prioridad === "Alta"
                          ? "bg-red-200"
                          : mantenimiento.prioridad === "medio"
                          ? "bg-orange-200"
                          : "bg-green-200"
                      }`}
                    >
                      {mantenimiento.prioridad}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(mantenimiento.fecha_ini).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {mantenimiento.fecha_fin
                      ? new Date(mantenimiento.fecha_fin).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => setMantenimientoSeleccionado(mantenimiento.id_mantenimiento)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Detalles
                    </button>
                    {rolSimulado === "admin" && (
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionMantenimiento;
