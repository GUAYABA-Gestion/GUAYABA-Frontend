"use client";

import { useState } from "react";
import { Evento } from "../../../../types/api";
import ExcelExportButton from "./EventoExcelExportButton"; // Asumiendo que tienes un componente para exportar a Excel

interface EventoTableProps {
  eventos: Evento[];
  programas: any[];
  onEventoClick: (evento: Evento) => void;
  onVerEventoClick: (evento: Evento) => void;
}

const EventoTable: React.FC<EventoTableProps> = ({
  eventos,
  programas,
  onEventoClick,
  onVerEventoClick,
}) => {
  const [searchNombre, setSearchNombre] = useState("");
  const [searchFacultad, setSearchFacultad] = useState("");
  const [searchPrograma, setSearchPrograma] = useState("");
  const [searchFechaInicio, setSearchFechaInicio] = useState("");
  const [searchFechaFin, setSearchFechaFin] = useState("");
  const [searchHoraInicio, setSearchHoraInicio] = useState("");
  const [searchHoraFin, setSearchHoraFin] = useState("");

  const handleResetFilters = () => {
    setSearchNombre("");
    setSearchFacultad("");
    setSearchPrograma("");
    setSearchFechaInicio("");
    setSearchFechaFin("");
    setSearchHoraInicio("");
    setSearchHoraFin("");
  };

  const uniqueProgramas = [...new Set(programas.map((p) => p.programa_nombre))];
  const uniqueFacultades = [
    ...new Set(programas.map((p) => p.facultad_nombre)),
  ];

  const filteredEventos = eventos.filter((evento) => {
    const programa = programas.find(
      (p) => p.id_programa === evento.id_programa
    );
    const facultadNombre = programa ? programa.facultad_nombre : "";
    const programaNombre = programa ? programa.programa_nombre : "";

    return (
      (evento.nombre?.toLowerCase().includes(searchNombre.toLowerCase()) ?? false) &&
      facultadNombre.toLowerCase().includes(searchFacultad.toLowerCase()) &&
      programaNombre.toLowerCase().includes(searchPrograma.toLowerCase()) &&
      evento.fecha_inicio.includes(searchFechaInicio) &&
      evento.fecha_fin.includes(searchFechaFin) &&
      evento.hora_inicio.includes(searchHoraInicio) &&
      evento.hora_fin.includes(searchHoraFin)
    );
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="mb-4 flex flex-wrap items-end gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
          className="p-2 border rounded text-black text-sm w-full md:w-auto"
        />
        <select
          value={searchFacultad}
          onChange={(e) => setSearchFacultad(e.target.value)}
          className="p-2 border rounded text-black text-sm w-full md:w-auto"
        >
          <option value="">Buscar por facultad</option>
          {uniqueFacultades.map((facultad) => (
            <option key={facultad} value={facultad}>
              {facultad}
            </option>
          ))}
        </select>
        <select
          value={searchPrograma}
          onChange={(e) => setSearchPrograma(e.target.value)}
          className="p-2 border rounded text-black text-sm w-full md:w-auto"
        >
          <option value="">Buscar por programa</option>
          {uniqueProgramas.map((programa) => (
            <option key={programa} value={programa}>
              {programa}
            </option>
          ))}
        </select>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Fecha Inicio</label>
          <input
            type="date"
            value={searchFechaInicio}
            onChange={(e) => setSearchFechaInicio(e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Fecha Fin</label>
          <input
            type="date"
            value={searchFechaFin}
            onChange={(e) => setSearchFechaFin(e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Hora Inicio</label>
          <input
            type="time"
            value={searchHoraInicio}
            onChange={(e) => setSearchHoraInicio(e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Hora Fin</label>
          <input
            type="time"
            value={searchHoraFin}
            onChange={(e) => setSearchHoraFin(e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
        </div>
        <button
          onClick={handleResetFilters}
          className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
        >
          Reiniciar Filtros
        </button>
        {/* <ExcelExportButton eventos={filteredEventos} programas={programas} /> */}
      </div>
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th
                  colSpan={8}
                  className="border bg-[#80BA7F] text-white px-4 py-2 text-lg font-semibold"
                >
                  Tabla de Eventos
                </th>
              </tr>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                  Nombre
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Tipo
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[300px]">
                  Fecha y Hora
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">
                  Programa
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">
                  Facultad
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEventos.length > 0 ? (
                filteredEventos.map((evento, index) => {
                  const programa = programas.find(
                    (p) => p.id_programa === evento.id_programa
                  );
                  return (
                    <tr
                      key={evento.id_evento}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="border border-gray-300 p-2 text-black text-sm">
                        {evento.nombre}
                      </td>
                      <td className="border border-gray-300 p-2 text-black text-sm">
                        {evento.tipo}
                      </td>
                      <td className="border border-gray-300 p-2 text-black text-sm">
                        {`${formatDate(evento.fecha_inicio)} hasta ${formatDate(evento.fecha_fin)} de ${evento.hora_inicio} a ${evento.hora_fin}`}
                      </td>
                      <td className="border border-gray-300 p-2 text-black text-sm">
                        {programa ? programa.programa_nombre : "N/A"}
                      </td>
                      <td className="border border-gray-300 p-2 text-black text-sm">
                        {programa ? programa.facultad_nombre : "N/A"}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => onEventoClick(evento)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => onVerEventoClick(evento)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                          >
                            Ver en Calendario
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="border border-gray-300 p-2 text-center text-gray-600 text-sm"
                  >
                    No hay eventos para mostrar.
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

export default EventoTable;