"use client";
import React from "react";
import ExcelJS from "exceljs";
import { Log } from "../../../types/api";

interface AuditExcelExportButtonProps {
  logs: Log[];
  filters: {
    fecha: string;
    operacion: string;
    tabla: string;
  };
}

const AuditExcelExportButton: React.FC<AuditExcelExportButtonProps> = ({ logs, filters }) => {
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Historial");

    worksheet.columns = [
      { header: "ID", key: "id_auditoria", width: 10 },
      { header: "Tabla Afectada", key: "tabla_afectada", width: 30 },
      { header: "Operación", key: "operacion", width: 20 },
      { header: "Fecha - Hora", key: "fecha_hora", width: 30 },
      { header: "Datos Anteriores", key: "datos_anteriores", width: 50 },
      { header: "Datos Nuevos", key: "datos_nuevos", width: 50 },
    ];

    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.fecha_hora).toISOString().split("T")[0];
      return (
        (filters.fecha === "" || logDate === filters.fecha) &&
        (filters.operacion === "" || log.operacion === filters.operacion) &&
        (filters.tabla === "" || log.tabla_afectada === filters.tabla)
      );
    });

    filteredLogs.forEach((log) => {
      worksheet.addRow({
        id_auditoria: log.id_auditoria,
        tabla_afectada: log.tabla_afectada,
        operacion: log.operacion,
        fecha_hora: new Date(log.fecha_hora).toLocaleString(),
        datos_anteriores: JSON.stringify(log.datos_anteriores, null, 2),
        datos_nuevos: JSON.stringify(log.datos_nuevos, null, 2),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const date = new Date().toISOString().split("T")[0];
    const filtersString = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}-${value}`)
      .join("_");

    const fileName = `historial_${filtersString}_${date}.xlsx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownloadExcel}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
    >
      Descargar tabla con filtros aplicados
    </button>
  );
};

export default AuditExcelExportButton;