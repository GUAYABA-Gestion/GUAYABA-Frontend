"use client";
import React, { useState } from "react";
import { Log, User } from "../../../types/api";
import AuditExcelExportButton from "./AuditExcelExportButton";

interface AuditTableProps {
  logs: Log[];
  users: User[];
  filters: {
    fecha: string;
    operacion: string;
    tabla: string;
    horaInicio: string;
    horaFin: string;
    correo: string; // Nuevo filtro para correo
  };
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: string, value: string) => void;
  onDetailsClick: (log: Log) => void;
  resetFilters: () => void;
}

const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  users,
  filters,
  currentPage,
  itemsPerPage,
  onPageChange,
  onFilterChange,
  onDetailsClick,
  resetFilters,
}) => {
  const [jumpPage, setJumpPage] = useState<number | string>("");
  const [validationMessage, setValidationMessage] = useState<string>("");

  const getUserEmail = (id_persona: number) => {
    if (id_persona === -1) {
      return "AÑADIDO AUTOMÁTICAMENTE";
    }
    const user = users.find((user) => user.id_persona === id_persona);
    return user ? user.correo : "";
  };

  const handleHoraInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const horaInicio = parseInt(value, 10);
    const horaFin = filters.horaFin ? parseInt(filters.horaFin, 10) : 24;

    if (horaInicio >= 0 && horaInicio <= 23 && horaInicio < horaFin) {
      setValidationMessage("");
      onFilterChange("horaInicio", value);
    } else {
      setValidationMessage(
        `La hora de inicio debe estar entre 0 y 23 y ser menor que la hora fin.`
      );
    }
  };

  const handleHoraFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const horaFin = parseInt(value, 10);
    const horaInicio = filters.horaInicio
      ? parseInt(filters.horaInicio, 10)
      : 0;

    if (horaFin >= 0 && horaFin <= 24 && horaFin > horaInicio) {
      setValidationMessage("");
      onFilterChange("horaFin", value);
    } else {
      setValidationMessage(
        `La hora fin debe estar entre 0 y 24 y ser mayor que la hora inicio.`
      );
    }
  };

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.fecha_hora).toISOString().split("T")[0];
    const logTime = new Date(log.fecha_hora).getHours();
    const horaInicio = filters.horaInicio
      ? parseInt(filters.horaInicio, 10)
      : 0;
    const horaFin = filters.horaFin ? parseInt(filters.horaFin, 10) : 24;
    const userEmail = getUserEmail(log.id_persona) || "";

    return (
      (filters.fecha === "" || logDate === filters.fecha) &&
      (filters.operacion === "" || log.operacion === filters.operacion) &&
      (filters.tabla === "" || log.tabla_afectada === filters.tabla) &&
      (filters.horaInicio === "" ||
        (logTime >= horaInicio && logTime < horaFin)) &&
      (filters.correo === "" ||
        userEmail.toLowerCase().includes(filters.correo.toLowerCase()))
    );
  });

  const getOperacionCompleta = (operacion: string) => {
    switch (operacion) {
      case "INSERT":
        return "ADICIÓN DE DATOS";
      case "UPDATE":
        return "ACTUALIZACIÓN DE DATOS";
      case "DELETE":
        return "ELIMINACIÓN DE DATOS";
      default:
        return operacion;
    }
  };

  const tablas = [
    { value: "persona", label: "Persona" },
    { value: "sede", label: "Sede" },
    { value: "edificio", label: "Edificio" },
    { value: "espacio", label: "Espacio" },
    { value: "evento", label: "Evento" },
    { value: "mantenimiento", label: "Mantenimiento" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleJumpPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setJumpPage("");
    } else {
      const pageNumber = parseInt(value, 10);
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
        setJumpPage(pageNumber);
      }
    }
  };

  const handleJumpPage = () => {
    if (
      typeof jumpPage === "number" &&
      jumpPage > 0 &&
      jumpPage <= totalPages
    ) {
      onPageChange(jumpPage);
      setJumpPage("");
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          onClick={() => onPageChange(1)}
          className="mx-1 px-4 py-2 rounded text-sm bg-gray-200 text-black hover:bg-gray-300"
        >
          {"<<"}
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-4 py-2 rounded text-sm ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="last"
          onClick={() => onPageChange(totalPages)}
          className="mx-1 px-4 py-2 rounded text-sm bg-gray-200 text-black hover:bg-gray-300"
        >
          {">>"}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="p-4 bg-gray-50">
      {/* Filtros y botones */}
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={filters.fecha}
            onChange={(e) => onFilterChange("fecha", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
            placeholder="Filtrar por fecha"
          />
          <select
            value={filters.operacion}
            onChange={(e) => onFilterChange("operacion", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por acciones</option>
            <option value="INSERT">ADICIÓN DE DATOS</option>
            <option value="UPDATE">ACTUALIZACIÓN DE DATOS</option>
            <option value="DELETE">ELIMINACIÓN DE DATOS</option>
          </select>
          <select
            value={filters.tabla}
            onChange={(e) => onFilterChange("tabla", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por tablas</option>
            {tablas.map((tabla) => (
              <option key={tabla.value} value={tabla.value}>
                {tabla.label}
              </option>
            ))}
          </select>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Hora de Inicio</label>
            <input
              type="number"
              value={filters.horaInicio}
              onChange={handleHoraInicioChange}
              placeholder="Hora de Inicio"
              className="p-2 border rounded text-black text-sm w-full md:w-auto"
              min="0"
              max="23"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Hora Fin</label>
            <input
              type="number"
              value={filters.horaFin}
              onChange={handleHoraFinChange}
              placeholder="Hora Fin"
              className="p-2 border rounded text-black text-sm w-full md:w-auto"
              min={filters.horaInicio}
              max="24"
            />
          </div>
          <input
            type="text"
            value={filters.correo}
            onChange={(e) => onFilterChange("correo", e.target.value)}
            placeholder="Filtrar por correo"
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
          <button
            onClick={resetFilters}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
          >
            Reiniciar Filtros
          </button>
          <AuditExcelExportButton logs={logs} filters={filters} />
        </div>
        {validationMessage && (
          <div className="text-red-500 text-sm mt-2">{validationMessage}</div>
        )}
      </div>

      {/* Tabla */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th
                colSpan={5}
                className="border bg-[#80BA7F] text-white px-4 py-2 text-lg font-semibold"
              >
                Tabla de Auditoría
              </th>
            </tr>
            <tr className="bg-[#80BA7F] text-white">
              <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                Tabla Afectada
              </th>
              <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                Acción
              </th>
              <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                Realizado por
              </th>
              <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                Fecha - Hora
              </th>
              <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, index) => (
                <tr
                  key={log.id_auditoria}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="border border-gray-300 p-2 text-black text-sm">
                    {log.tabla_afectada}
                  </td>
                  <td className="border border-gray-300 p-2 text-black text-sm">
                    {getOperacionCompleta(log.operacion)}
                  </td>
                  <td className="border border-gray-300 p-2 text-black text-sm">
                    {getUserEmail(log.id_persona)}
                  </td>
                  <td className="border border-gray-300 p-2 text-black text-sm">
                    {new Date(log.fecha_hora).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => onDetailsClick(log)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 p-2 text-center text-gray-600 text-sm"
                >
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4">{renderPagination()}</div>
      <div className="flex items-center justify-center mt-4">
        <span className="mr-2 text-sm text-gray-600">
          {" "}
          {totalPages} Páginas en total{" "}
        </span>
        <input
          type="number"
          value={jumpPage}
          onChange={handleJumpPageChange}
          placeholder="Saltar a la página"
          className="p-2 border rounded text-black text-sm w-22 mr-2"
        />
        <button
          onClick={handleJumpPage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm"
        >
          Ir
        </button>
      </div>
    </div>
  );
};

export default AuditTable;
