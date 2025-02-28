"use client";
import { useState } from "react";
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

    const validExtensions = [".xlsx"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const validMimeTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    if (!validExtensions.includes(fileExtension) || !validMimeTypes.includes(file.type)) {
      alert("Por favor, sube un archivo válido (.xlsx)");
      event.target.value = ""; // Reinicia el input
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target?.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as ArrayBuffer);
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        setError("No se pudo encontrar la hoja de cálculo en el archivo.");
        return;
      }
      const rows = worksheet.getSheetValues();
      const headers = rows[1] as string[];

      const parsedMantenimientos: Mantenimiento[] = rows.slice(2).map((row: any) => ({
        id_mantenimiento: 0,
        id_espacio: idEspacio,
        id_encargado: maints.find((maint) => maint.correo === row[headers.indexOf("correo_encargado")])?.id_persona || null,
        tipo_contrato: row[headers.indexOf("tipo_contrato")] || "",
        tipo: row[headers.indexOf("tipo")] || "",
        estado: row[headers.indexOf("estado")] || "",
        necesidad: row[headers.indexOf("necesidad")] || "",
        prioridad: row[headers.indexOf("prioridad")] || "",
        detalle: row[headers.indexOf("detalle")] || "",
        fecha_asignacion: row[headers.indexOf("fecha_asignacion")] || "",
        plazo_ideal: Number(row[headers.indexOf("plazo_ideal")]) || 0,
        terminado: row[headers.indexOf("terminado")] === "true",
        observación: row[headers.indexOf("observación")] || "",
      }));

      onMantenimientosParsed(parsedMantenimientos);
    };
    reader.readAsArrayBuffer(file);
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

    worksheet.getCell("A1").note = "Correo del encargado del mantenimiento (ver hoja 'Valores Posibles')";
    worksheet.getCell("B1").note = "Tipo de contrato del mantenimiento";
    worksheet.getCell("C1").note = "Tipo de mantenimiento (ver hoja 'Valores Posibles')";
    worksheet.getCell("D1").note = "Estado del mantenimiento (ver hoja 'Valores Posibles')";
    worksheet.getCell("E1").note = "Necesidad del mantenimiento (ver hoja 'Valores Posibles')";
    worksheet.getCell("F1").note = "Prioridad del mantenimiento (ver hoja 'Valores Posibles')";
    worksheet.getCell("G1").note = "Detalle del mantenimiento";
    worksheet.getCell("H1").note = "Fecha de asignación del mantenimiento (YYYY-MM-DD)";
    worksheet.getCell("I1").note = "Plazo ideal en días";
    worksheet.getCell("J1").note = "Indica si el mantenimiento está terminado (true/false)";
    worksheet.getCell("K1").note = "Observación del mantenimiento";

    // Crear una segunda hoja con los valores posibles
    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Correo Encargado", key: "correo_encargado", width: 25 },
      { header: "Tipo de Mantenimiento", key: "tipo", width: 20 },
      { header: "Estado", key: "estado", width: 20 },
      { header: "Necesidad", key: "necesidad", width: 20 },
      { header: "Prioridad", key: "prioridad", width: 20 },
    ];

    const maxRows = Math.max(maints.length, tiposMantenimiento.length, estadosMantenimiento.length, necesidadesMantenimiento.length, prioridadesMantenimiento.length);

    for (let i = 0; i < maxRows; i++) {
      valoresPosiblesSheet.addRow({
        correo_encargado: maints[i] ? maints[i].correo : "",
        tipo: tiposMantenimiento[i] || "",
        estado: estadosMantenimiento[i] || "",
        necesidad: necesidadesMantenimiento[i] || "",
        prioridad: prioridadesMantenimiento[i] || "",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "mantenimiento_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <input type="file" accept=".xlsx" onChange={handleFileUpload} className="mt-4 text-black" />

      <button onClick={handleDownloadTemplate} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
        Descargar Plantilla Excel
      </button>

      <div className="mt-4 text-black">
        <p><b>Por favor, cargue los datos siguiendo la plantilla.</b></p>
      </div>
    </div>
  );
};

export default AddMantenimientoCSV;