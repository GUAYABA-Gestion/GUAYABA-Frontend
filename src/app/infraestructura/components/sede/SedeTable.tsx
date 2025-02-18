"use client";
import { useState, useEffect } from "react";
import { User, Sede, Municipio } from "../../../../types/api";

interface SedeTableProps {
  sedes: Sede[];
  municipios: Municipio[];
  coordinadores: User[];
  selectedSedes: number[];
  onSedeSelect: (id: number) => void;
  onSedeDeselect: (id: number) => void;
  onSedeClick: (sede: Sede) => void;
}

const SedeTable = ({
  sedes,
  municipios,
  coordinadores,
  selectedSedes,
  onSedeSelect,
  onSedeDeselect,
  onSedeClick,
}: SedeTableProps) => {
  const handleCheckboxChange = (id: number) => {
    if (selectedSedes.includes(id)) {
      onSedeDeselect(id);
    } else {
      onSedeSelect(id);
    }
  };

  const getMunicipioNombre = (id: number | undefined) => {
    const municipio = municipios.find((m) => m.id === id);
    return municipio ? municipio.nombre : "Sin municipio";
  };

  const getCoordinadorCorreo = (id: number | null | undefined) => {
    const coordinador = coordinadores.find((c) => c.id_persona === id);
    return coordinador ? coordinador.correo : "Sin coordinador";
  };

  return (
    <div className="p-4 bg-gray-50 min-h">
      {/* Tabla */}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-[#80BA7F] text-white">
              <th className="border border-gray-300 p-2 w-1/4">Seleccionar</th>
              <th className="border border-gray-300 p-2 w-1/4">Nombre</th>
              <th className="border border-gray-300 p-2 w-1/4">Municipio</th>
              <th className="border border-gray-300 p-2 w-1/4">Coordinador</th>
              <th className="border border-gray-300 p-2 w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.length > 0 ? (
              sedes.map((sede, index) => (
                <tr
                  key={sede.id_sede}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedSedes.includes(sede.id_sede)}
                      onChange={() => handleCheckboxChange(sede.id_sede)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {sede.nombre}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {getMunicipioNombre(sede.municipio)}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {getCoordinadorCorreo(sede.coordinador)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => onSedeClick(sede)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-gray-300 p-2 text-center text-gray-600">
                  No hay sedes para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SedeTable;
