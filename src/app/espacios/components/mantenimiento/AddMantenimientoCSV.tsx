"use client";
import { useState } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { Mantenimiento, User } from "../../../../types/api";
import { estadosMantenimiento, tiposMantenimiento, prioridadesMantenimiento, necesidadesMantenimiento } from "../../../api/desplegableValues";

interface AddMantenimientoCSVProps {
  onMantenimientosParsed: (parsedMantenimientos: Mantenimiento[]) => void;
  onClose: () => void;
  maints: User[];
  idEspacio: number;
}

const AddMantenimientoCSV: React.FC<AddMantenimientoCSVProps> = ({
  onMantenimientosParsed,
  onClose,
  maints,
  idEspacio,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = [".csv"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const validMimeTypes = ["text/csv", "application/vnd.ms-excel"];

    if (!validExtensions.includes(fileExtension) || !validMimeTypes.includes(file.type)) {
      alert("Por favor, sube un archivo válido (.csv)");
      event.target.value = ""; // Reinicia el input
      return;
    }

    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedMantenimientos: Mantenimiento[] = result.data.map((row: any) => ({
          id_mantenimiento: 0,
          id_espacio: idEspacio,
          id_encargado: maints.find((maint) => maint.correo === row.correo_encargado)?.id_persona || null,
          tipo_contrato: row.tipo_contrato || "",
          tipo: row.tipo || "",
          estado: row.estado || "",
          necesidad: row.necesidad || "",
          prioridad: row.prioridad || "",
          detalle: row.detalle || "",
          fecha_asignacion: row.fecha_asignacion || "",
          plazo_ideal: Number(row.plazo_ideal) || 0,
          terminado: row.terminado === "true",
          observación: row.observación || "",
        }));

        onMantenimientosParsed(parsedMantenimientos);
      },
      error: (err) => console.error("Error al leer CSV:", err.message),
    });
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Mantenimientos");

    worksheet.columns = [
      { header: "correo_encargado", key: "correo_encargado", width: 25 },
      { header: "tipo_contrato", key: "tipo_contrato", width: 15 },
      { header: "tipo", key: "tipo", width: 15 },
      { header: "estado", key: "estado", width: 15 },
      { header: "necesidad", key: "necesidad", width: 15 },
      { header: "prioridad", key: "prioridad", width: 15 },
      { header: "detalle", key: "detalle", width: 30 },
      { header: "fecha_asignacion", key: "fecha_asignacion", width: 15 },
      { header: "plazo_ideal", key: "plazo_ideal", width: 15 },
      { header: "terminado", key: "terminado", width: 10 },
      { header: "observación", key: "observación", width: 30 },
    ];

    worksheet.addRow(["encargado@correo.com", "tipo_contrato", "tipo", "estado", "necesidad", "prioridad", "Detalle del mantenimiento", "2025-01-01", 30, "false", "Observación"]);

    worksheet.getCell("A1").note = "Correo del encargado del mantenimiento";
    worksheet.getCell("B1").note = "Tipo de contrato del mantenimiento";
    worksheet.getCell("C1").note = `Tipo de mantenimiento. Los valores aceptados son: ${tiposMantenimiento.join(", ")}`;
    worksheet.getCell("D1").note = `Estado del mantenimiento. Los valores aceptados son: ${estadosMantenimiento.join(", ")}`;
    worksheet.getCell("E1").note = `Necesidad del mantenimiento. Los valores aceptados son: ${necesidadesMantenimiento.join(", ")}`;
    worksheet.getCell("F1").note = `Prioridad del mantenimiento. Los valores aceptados son: ${prioridadesMantenimiento.join(", ")}`;
    worksheet.getCell("G1").note = "Detalle del mantenimiento";
    worksheet.getCell("H1").note = "Fecha de asignación del mantenimiento (YYYY-MM-DD)";
    worksheet.getCell("I1").note = "Plazo ideal en días";
    worksheet.getCell("J1").note = "Indica si el mantenimiento está terminado (true/false)";
    worksheet.getCell("K1").note = "Observación del mantenimiento";

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "mantenimiento_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4 text-black" />

      <button onClick={handleDownloadTemplate} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
        Descargar Plantilla Excel
      </button>

      <div className="mt-4 text-black">
        <p><b>Por favor, guarde el archivo como CSV UTF-8 antes de subirlo.</b></p>
      </div>
    </div>
  );
};

export default AddMantenimientoCSV;