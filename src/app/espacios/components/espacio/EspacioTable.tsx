"use client";

import { useState } from "react";
import { Espacio } from "../../../../types/api";
import { estadosEspacio, clasificacionesEspacio, usosEspacio, tiposEspacio, pisosEspacio } from "../../../api/auth/desplegableValues";

interface EspacioTableProps {
  espacios: Espacio[];
  onEspacioClick: (espacio: Espacio) => void;
  onEspacioSelect: (id: number) => void;
  selectedEspacioId: number | null;
  rol: string; // Añadir el rol
}

const EspacioTable: React.FC<EspacioTableProps> = ({ espacios, onEspacioClick, onEspacioSelect, selectedEspacioId, rol }) => {
  const [filters, setFilters] = useState({
    nombre: "",
    estado: "",
    clasificacion: "",
    uso: "",
    tipo: "",
    piso: "",
  });

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const filteredEspacios = espacios.filter((espacio) => {
    return (
      (filters.nombre === "" || espacio.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
      (filters.estado === "" || espacio.estado === filters.estado) &&
      (filters.clasificacion === "" || espacio.clasificacion === filters.clasificacion) &&
      (filters.uso === "" || espacio.uso === filters.uso) &&
      (filters.tipo === "" || espacio.tipo === filters.tipo) &&
      (filters.piso === "" || espacio.piso.toString() === filters.piso)
    );
  });

  return (
    <div className="p-4 bg-gray-50 min-h">
      {/* Filtros */}
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filters.nombre}
            onChange={(e) => handleFilterChange("nombre", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
          <select
            value={filters.estado}
            onChange={(e) => handleFilterChange("estado", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por estado</option>
            {estadosEspacio.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          {rol !== "user" && (
            <>
              <select
                value={filters.clasificacion}
                onChange={(e) => handleFilterChange("clasificacion", e.target.value)}
                className="p-2 border rounded text-black text-sm w-full md:w-auto"
              >
                <option value="">Filtrar por clasificación</option>
                {clasificacionesEspacio.map((clasificacion) => (
                  <option key={clasificacion} value={clasificacion}>
                    {clasificacion}
                  </option>
                ))}
              </select>
              <select
                value={filters.uso}
                onChange={(e) => handleFilterChange("uso", e.target.value)}
                className="p-2 border rounded text-black text-sm w-full md:w-auto"
              >
                <option value="">Filtrar por uso</option>
                {usosEspacio.map((uso) => (
                  <option key={uso} value={uso}>
                    {uso}
                  </option>
                ))}
              </select>
            </>
          )}
          <select
            value={filters.tipo}
            onChange={(e) => handleFilterChange("tipo", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por tipo</option>
            {tiposEspacio.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          <select
            value={filters.piso}
            onChange={(e) => handleFilterChange("piso", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por piso</option>
            {pisosEspacio.map((piso) => (
              <option key={piso} value={piso}>
                {piso}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ nombre: "", estado: "", clasificacion: "", uso: "", tipo: "", piso: "" })}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
          >
            Reiniciar Filtros
          </button>
        </div>
      </div>
  
      {/* Tabla */}
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Seleccionar</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Nombre</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Estado</th>
                {rol !== "user" && (
                  <>
                    <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Clasificación</th>
                    <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Uso</th>
                  </>
                )}
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Tipo</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Piso</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[140px]">Capacidad</th>
                {(rol === "admin" || rol === "coord") && (
                  <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredEspacios.length > 0 ? (
                filteredEspacios.map((espacio, index) => (
                  <tr
                    key={espacio.id_espacio}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="border border-gray-300 p-2 text-center">
                      <input
                        type="radio"
                        name="selectEspacio"
                        checked={selectedEspacioId === espacio.id_espacio}
                        onChange={() => onEspacioSelect(espacio.id_espacio)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {espacio.nombre}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {espacio.estado}
                    </td>
                    {rol !== "user" && (
                      <>
                        <td className="border border-gray-300 p-2 text-black text-sm">
                          {espacio.clasificacion}
                        </td>
                        <td className="border border-gray-300 p-2 text-black text-sm">
                          {espacio.uso}
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {espacio.tipo}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {espacio.piso}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {espacio.capacidad}
                    </td>
                    {(rol === "admin" || rol === "coord") && (
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => onEspacioClick(espacio)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="border border-gray-300 p-2 text-center text-gray-600 text-sm">
                    No hay espacios para mostrar.
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

export default EspacioTable;