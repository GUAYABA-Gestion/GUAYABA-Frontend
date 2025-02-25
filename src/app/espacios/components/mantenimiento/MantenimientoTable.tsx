"use client";

import { useState } from "react";
import { Mantenimiento, User } from "../../../../types/api";
import { estadosMantenimiento, tiposMantenimiento, prioridadesMantenimiento } from "../../../api/desplegableValues";

interface MantenimientoTableProps {
  mantenimientos: Mantenimiento[];
  maints: User[]; // Arreglo de usuarios de mantenimiento
  onMantenimientoClick: (mantenimiento: Mantenimiento) => void;
  onAddMantenimientoClick: () => void; // Nueva prop para manejar el clic en "Añadir Mantenimiento"
}

const MantenimientoTable: React.FC<MantenimientoTableProps> = ({
  mantenimientos,
  maints,
  onMantenimientoClick,
  onAddMantenimientoClick, // Recibir la prop
}) => {
  const [filters, setFilters] = useState({
    estado: "",
    tipo: "",
    prioridad: "",
  });

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    return (
      (filters.estado === "" || mantenimiento.estado === filters.estado) &&
      (filters.tipo === "" || mantenimiento.tipo === filters.tipo) &&
      (filters.prioridad === "" || mantenimiento.prioridad === filters.prioridad)
    );
  });

  const getCorreoById = (id: number) => {
    const maint = maints.find((m) => m.id_persona === id);
    return maint ? maint.correo : "Desconocido";
  };

  return (
    <div className="p-4 bg-gray-50 min-h">
      {/* Filtros y botón de Añadir Mantenimiento */}
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.estado}
            onChange={(e) => handleFilterChange("estado", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por estado</option>
            {estadosMantenimiento.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <select
            value={filters.tipo}
            onChange={(e) => handleFilterChange("tipo", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por tipo</option>
            {tiposMantenimiento.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          <select
            value={filters.prioridad}
            onChange={(e) => handleFilterChange("prioridad", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por prioridad</option>
            {prioridadesMantenimiento.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ estado: "", tipo: "", prioridad: "" })}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
          >
            Reiniciar Filtros
          </button>
          <button
            onClick={onAddMantenimientoClick} // Usar la función para abrir el modal
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300 text-sm w-full md:w-auto"
          >
            + Añadir Mantenimiento
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Encargado</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Estado</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Tipo</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Prioridad</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Detalle</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMantenimientos.length > 0 ? (
                filteredMantenimientos.map((mantenimiento, index) => (
                  <tr
                    key={mantenimiento.id_mantenimiento}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {getCorreoById(mantenimiento.id_encargado)}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {mantenimiento.estado}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {mantenimiento.tipo}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {mantenimiento.prioridad}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {mantenimiento.detalle}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => onMantenimientoClick(mantenimiento)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-gray-300 p-2 text-center text-gray-600 text-sm">
                    No hay mantenimientos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MantenimientoTable;