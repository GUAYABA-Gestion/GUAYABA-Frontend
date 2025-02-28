"use client";

import { useState, useRef } from "react";
import ExcelJS from "exceljs";
import { Evento, Programa } from "../../../../types/api";
import { tiposEvento } from "../../../api/desplegableValues";

interface AddEventoCSVProps {
  onEventosParsed: (parsedEventos: Evento[]) => void;
  onClose: () => void;
  programas: Programa[];
  idEspacio: number;
}

const AddEventoCSV: React.FC<AddEventoCSVProps> = ({
  onEventosParsed,
  onClose,
  programas,
  idEspacio,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

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

      const parsedEventos: Evento[] = rows.slice(2).map((row: any) => ({
        id_evento: 0,
        id_espacio: idEspacio,
        nombre: row[headers.indexOf("nombre")] || "",
        tipo: row[headers.indexOf("tipo")] || "",
        id_programa: row[headers.indexOf("programa")] || 0,
        fecha_inicio: row[headers.indexOf("fecha_inicio")] || "",
        hora_inicio: row[headers.indexOf("hora_inicio")] || "",
        fecha_fin: row[headers.indexOf("fecha_fin")] || "",
        hora_fin: row[headers.indexOf("hora_fin")] || "",
        descripcion: row[headers.indexOf("descripcion")] || "",
        días: row[headers.indexOf("días")] || "",
        estado: "pendiente",
      }));

      onEventosParsed(parsedEventos);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Eventos");

    worksheet.columns = [
      { header: "nombre", key: "nombre", width: 30 },
      { header: "tipo", key: "tipo", width: 20 },
      { header: "programa", key: "programa", width: 20 },
      { header: "fecha_inicio", key: "fecha_inicio", width: 15 },
      { header: "hora_inicio", key: "hora_inicio", width: 15 },
      { header: "fecha_fin", key: "fecha_fin", width: 15 },
      { header: "hora_fin", key: "hora_fin", width: 15 },
      { header: "descripcion", key: "descripcion", width: 30 },
      { header: "días", key: "días", width: 10 },
    ];

    worksheet.addRow(["Nombre Ejemplo", "Tipo Ejemplo", "ID Programa Ejemplo", "2025-01-01", "08:00", "2025-01-02", "10:00", "Descripción Ejemplo", "LMX"]);

    worksheet.getCell("A1").note = "Nombre: Nombre del evento";
    worksheet.getCell("B1").note = "Tipo: Tipo del evento (ver hoja 'Valores Posibles')";
    worksheet.getCell("C1").note = "Programa: ID del programa asociado (ver hoja 'Valores Posibles')";
    worksheet.getCell("D1").note = "Fecha de Inicio: Fecha de inicio del evento (YYYY-MM-DD)";
    worksheet.getCell("E1").note = "Hora de Inicio: Hora de inicio del evento (HH:MM)";
    worksheet.getCell("F1").note = "Fecha de Fin: Fecha de fin del evento (YYYY-MM-DD)";
    worksheet.getCell("G1").note = "Hora de Fin: Hora de fin del evento (HH:MM)";
    worksheet.getCell("H1").note = "Descripción: Descripción del evento";
    worksheet.getCell("I1").note = "Días: Días de la semana en los que se repite el evento (L, M, X, J, V, S, D)";

    // Crear una segunda hoja con los valores posibles
    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Tipo de Evento", key: "tipo_evento", width: 30 },
      { header: "ID del Programa", key: "id_programa", width: 20 },
      { header: "Nombre del Programa", key: "nombre_programa", width: 30 },
    ];

    tiposEvento.forEach((tipo) => {
      valoresPosiblesSheet.addRow({ tipo_evento: tipo });
    });

    // Organizar la lista de programas por ID
    programas.sort((a, b) => a.id_programa - b.id_programa).forEach((programa) => {
      valoresPosiblesSheet.addRow({ id_programa: programa.id_programa, nombre_programa: programa.programa_nombre });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "evento_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileUpload} className="mt-4 text-black" />

      <button onClick={handleDownloadTemplate} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
        Descargar Plantilla Excel
      </button>

      <div className="mt-4 text-black">
        <p><b>Por favor, cargue los datos siguiendo la plantilla.</b></p>
      </div>
    </div>
  );
};

export default AddEventoCSV;