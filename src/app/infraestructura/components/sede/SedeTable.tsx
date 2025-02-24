"use client";

import { useState } from "react";
import { Sede, Municipio, User } from "../../../../types/api";

interface SedeTableProps {
  sedes: Sede[];
  municipios: Municipio[];
  coordinadores: User[];
  selectedSedes: number[];
  onSedeSelect: (id: number) => void;
  onSedeDeselect: (id: number) => void;
  onSedeClick: (sede: Sede) => void;
  rolSimulado: string;
  idSede: number | null;
  onAddSedeClick: () => void;
}

const SedeTable: React.FC<SedeTableProps> = ({
  sedes,
  municipios,
  coordinadores,
  selectedSedes,
  onSedeSelect,
  onSedeDeselect,
  onSedeClick,
  rolSimulado,
  idSede,
  onAddSedeClick,
}) => {
  const [filters, setFilters] = useState({
    nombre: "",
    municipio: "",
  });

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const getMunicipioNombre = (id: number) => {
    const municipio = municipios.find((m) => m.id === id);
    return municipio ? municipio.nombre : "Sin municipio";
  };

  const getCoordinadorCorreo = (id: number | null | undefined) => {
    const coordinador = coordinadores.find((c) => c.id_persona === id);
    return coordinador ? coordinador.correo : "Sin coordinador";
  };

  const filteredSedes = sedes.filter((sede) => {
    return (
      (filters.nombre === "" || sede.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
      (filters.municipio === "" || getMunicipioNombre(sede.municipio).toLowerCase().includes(filters.municipio.toLowerCase()))
    );
  });

  const handleCheckboxChange = (id: number) => {
    if (selectedSedes.includes(id)) {
      onSedeDeselect(id);
    } else {
      onSedeSelect(id);
    }
  };

  const displayedSedes = rolSimulado === "admin" ? filteredSedes : filteredSedes.filter((sede) => sede.id_sede === idSede);

  return (
    <div className="p-4 bg-gray-50 min-h">
      {/* Filtros y botón de Añadir Sedes */}
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
            value={filters.municipio}
            onChange={(e) => handleFilterChange("municipio", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por municipio</option>
            {municipios.sort((a, b) => a.id - b.id).map((municipio) => (
              <option key={municipio.id} value={municipio.nombre}>
                {municipio.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ nombre: "", municipio: "" })}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
          >
            Reiniciar Filtros
          </button>
          {rolSimulado === "admin" && (
            <button
              onClick={onAddSedeClick}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300 text-sm w-full md:w-auto"
            >
              + Añadir Sedes
            </button>
          )}
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
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Municipio</th>
                {(rolSimulado !== "user") && (
                  <th className="border border-gray-300 px-4 py-2 min-w-[250px]">Coordinador</th>
                )}
                {rolSimulado === "admin" && (
                  <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedSedes.length > 0 ? (
                displayedSedes.map((sede, index) => (
                  <tr
                    key={sede.id_sede}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="border border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedSedes.includes(sede.id_sede)}
                        onChange={() => handleCheckboxChange(sede.id_sede)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {sede.nombre}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {getMunicipioNombre(sede.municipio)}
                    </td>
                    {(rolSimulado !== "user") && (
                      <td className="border border-gray-300 p-2 text-black text-sm">
                        {getCoordinadorCorreo(sede.coordinador)}
                      </td>
                    )}
                    {rolSimulado === "admin" && (
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => onSedeClick(sede)}
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
                  <td 
                    colSpan={rolSimulado === "admin" ? 5 : 4} 
                    className="border border-gray-300 p-2 text-center text-gray-600 text-sm"
                  >
                    No hay sedes para mostrar.
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

export default SedeTable;