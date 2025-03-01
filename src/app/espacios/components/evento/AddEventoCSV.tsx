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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const validExtensions = [".xlsx"];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      const validMimeTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

      if (!validExtensions.includes(fileExtension) || !validMimeTypes.includes(file.type)) {
        throw new Error("Por favor, sube un archivo válido (.xlsx)");
      }

      setSelectedFile(file);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer as ArrayBuffer);
          const worksheet = workbook.getWorksheet(1);
          if (!worksheet) throw new Error("No se pudo encontrar la hoja de cálculo en el archivo.");

          const rows = worksheet.getSheetValues();
          const headers = rows[1] as string[];

          const parsedEventos: Evento[] = rows.slice(2).map((row: any) => ({
            id_evento: 0,
            id_espacio: idEspacio,
            nombre: row[headers.indexOf("nombre")] || "",
            tipo: validarTipoEvento(row[headers.indexOf("tipo")]),
            id_programa: validarIdPrograma(row[headers.indexOf("programa")]),
            fecha_inicio: parseDate(row[headers.indexOf("fecha_inicio")]),
            hora_inicio: getHora(row[headers.indexOf("hora_inicio")]),
            fecha_fin: parseDate(row[headers.indexOf("fecha_fin")]),
            hora_fin: getHora(row[headers.indexOf("hora_fin")]),
            descripcion: row[headers.indexOf("descripcion")] || "",
            días: row[headers.indexOf("días")] || "",
            estado: "pendiente",
          }));

          onEventosParsed(parsedEventos);
        } catch (error: any) {
          setError(`Error procesando el archivo: ${error.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const parseDate = (cellValue: any) => {
    if (cellValue instanceof Date) {
      return cellValue.toISOString().split("T")[0]; // Convierte a formato YYYY-MM-DD
    }
    return formatDate(cellValue || "");
  };

  const getHora = (cellValue: any) => {
    if (cellValue instanceof Date) {
      return `${cellValue.getUTCHours().toString().padStart(2, "0")}:${cellValue.getUTCMinutes().toString().padStart(2, "0")}`;
    }
    return cellValue; // Si es string, asumir que ya viene bien
  };

  const validarTipoEvento = (tipo: any) => {
    return tiposEvento.includes(tipo) ? tipo : "Otro"; // "Otro" como valor por defecto si el tipo no es válido
  };

  const validarIdPrograma = (id: any) => {
    const parsedId = parseInt(id, 10);
    return isNaN(parsedId) ? 0 : parsedId; // Si no es número, asignar 0
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

    const exampleRow = worksheet.addRow([
      "Evento de Prueba",
      tiposEvento[0] || "Otro",
      programas.length > 0 ? programas[0].id_programa : 0,
      "01/01/2025",
      "08:00",
      "02/01/2025",
      "10:00",
      "Descripción de prueba",
      "LMX",
    ]);

    worksheet.getCell(`D${exampleRow.number}`).numFmt = "dd/mm/yyyy";
    worksheet.getCell(`F${exampleRow.number}`).numFmt = "dd/mm/yyyy";

    worksheet.getCell("A1").note = "Nombre: Nombre del evento";
    worksheet.getCell("B1").note = "Tipo: Tipo del evento (ver hoja 'Valores Posibles')";
    worksheet.getCell("C1").note = "Programa: ID del programa asociado (ver hoja 'Valores Posibles')";
    worksheet.getCell("D1").note = "Fecha de Inicio: Fecha de inicio del evento (dd/mm/yyyy)";
    worksheet.getCell("E1").note = "Hora de Inicio: Hora de inicio del evento (HH:MM)";
    worksheet.getCell("F1").note = "Fecha de Fin: Fecha de fin del evento (dd/mm/yyyy)";
    worksheet.getCell("G1").note = "Hora de Fin: Hora de fin del evento (HH:MM)";
    worksheet.getCell("H1").note = "Descripción: Descripción del evento";
    worksheet.getCell("I1").note = "Días: Días de la semana en los que se repite el evento (L, M, X, J, V, S, D)";

    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Tipo de Evento", key: "tipo_evento", width: 30 },
      { header: "ID del Programa", key: "id_programa", width: 20 },
      { header: "Nombre del Programa", key: "nombre_programa", width: 30 },
    ];

    const maxRows = Math.max(tiposEvento.length, programas.length);
    for (let i = 0; i < maxRows; i++) {
      valoresPosiblesSheet.addRow({
        tipo_evento: tiposEvento[i] || "",
        id_programa: programas[i] ? programas[i].id_programa : "",
        nombre_programa: programas[i] ? programas[i].programa_nombre : "",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "evento_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileUpload} className="mt-4 text-black" />
      <button onClick={handleDownloadTemplate} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
        Descargar Plantilla Excel
      </button>
    </div>
  );
};

export default AddEventoCSV;
