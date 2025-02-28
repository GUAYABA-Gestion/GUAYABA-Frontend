"use client";

import { useState, useRef } from "react";
import ExcelJS from "exceljs";
import { Espacio } from "../../../../types/api";
import { estadosEspacio, clasificacionesEspacio, usosEspacio, tiposEspacio, pisosEspacio } from "../../../api/desplegableValues";

interface AddEspacioCSVProps {
  onEspaciosParsed: (parsedEspacios: Espacio[]) => void;
  onClose: () => void;
  idEdificio: number;
}

const AddEspacioCSV: React.FC<AddEspacioCSVProps> = ({ onEspaciosParsed, onClose, idEdificio }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const parsedEspacios: Espacio[] = rows.slice(2).map((row: any) => ({
        id_espacio: 0,
        id_edificio: idEdificio,
        nombre: row[headers.indexOf("nombre")] || "",
        estado: row[headers.indexOf("estado")] || "",
        clasificacion: row[headers.indexOf("clasificacion")] || "",
        uso: row[headers.indexOf("uso")] || "",
        tipo: row[headers.indexOf("tipo")] || "",
        piso: row[headers.indexOf("piso")] || "",
        capacidad: Number(row[headers.indexOf("capacidad")]) || 0,
        mediciónmt2: Number(row[headers.indexOf("mediciónmt2")]) || 0,
      }));

      onEspaciosParsed(parsedEspacios);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Espacios");

    worksheet.columns = [
      { header: "nombre", key: "nombre", width: 20 },
      { header: "estado", key: "estado", width: 20 },
      { header: "clasificacion", key: "clasificacion", width: 20 },
      { header: "uso", key: "uso", width: 20 },
      { header: "tipo", key: "tipo", width: 20 },
      { header: "piso", key: "piso", width: 20 },
      { header: "capacidad", key: "capacidad", width: 20 },
      { header: "mediciónmt2", key: "mediciónmt2", width: 20 },
    ];

    worksheet.addRow(["Espacio Ejemplo", "En funcionamiento", "Edificio/Bloque", "Académico", "Aula/salón", "Primer Piso", 30, 50]);

    worksheet.getCell("A1").note = "Nombre: Nombre del espacio";
    worksheet.getCell("B1").note = `Estado: Estado del espacio (ver hoja 'Valores Posibles')`;
    worksheet.getCell("C1").note = `Clasificación: Clasificación del espacio (ver hoja 'Valores Posibles')`;
    worksheet.getCell("D1").note = `Uso: Uso del espacio (ver hoja 'Valores Posibles')`;
    worksheet.getCell("E1").note = `Tipo: Tipo del espacio (ver hoja 'Valores Posibles')`;
    worksheet.getCell("F1").note = `Piso: Piso del espacio (ver hoja 'Valores Posibles')`;
    worksheet.getCell("G1").note = "Capacidad: Capacidad del espacio en número de personas";
    worksheet.getCell("H1").note = "Medición (m²): Medición del espacio en metros cuadrados";

    // Crear una segunda hoja con los valores posibles
    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Estado", key: "estado", width: 20 },
      { header: "Clasificación", key: "clasificacion", width: 20 },
      { header: "Uso", key: "uso", width: 20 },
      { header: "Tipo", key: "tipo", width: 20 },
      { header: "Piso", key: "piso", width: 20 },
    ];

    const maxRows = Math.max(estadosEspacio.length, clasificacionesEspacio.length, usosEspacio.length, tiposEspacio.length, pisosEspacio.length);

    for (let i = 0; i < maxRows; i++) {
      valoresPosiblesSheet.addRow({
        estado: estadosEspacio[i] || "",
        clasificacion: clasificacionesEspacio[i] || "",
        uso: usosEspacio[i] || "",
        tipo: tiposEspacio[i] || "",
        piso: pisosEspacio[i] || "",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "espacio_template.xlsx");
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

export default AddEspacioCSV;