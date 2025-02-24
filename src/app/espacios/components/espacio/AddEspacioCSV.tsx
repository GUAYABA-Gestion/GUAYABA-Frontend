"use client";

import { useState } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { Espacio } from "../../../../types/api";
import { estadosEspacio, clasificacionesEspacio, usosEspacio, tiposEspacio, pisosEspacio } from "../../../api/desplegableValues";

interface AddEspacioCSVProps {
  onEspaciosAdded: (newEspacios: Espacio[]) => void;
  onClose: () => void;
  espacios: Espacio[];
  setEspacios: (espacios: Espacio[]) => void;
}

const AddEspacioCSV: React.FC<AddEspacioCSVProps> = ({ onEspaciosAdded, onClose, espacios, setEspacios }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedEspacios: Espacio[] = result.data.map((row: any) => ({
          id_espacio: 0,
          id_edificio: 0,
          nombre: row.nombre || "",
          estado: row.estado || "",
          clasificacion: row.clasificacion || "",
          uso: row.uso || "",
          tipo: row.tipo || "",
          piso: row.piso || "",
          capacidad: Number(row.capacidad) || 0,
          mediciónmt2: Number(row.mediciónmt2) || 0,
        }));

        setEspacios([...espacios, ...parsedEspacios]);
        onEspaciosAdded(parsedEspacios);
      },
      error: (err) => console.error("Error al leer CSV:", err.message),
    });
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
    worksheet.getCell("B1").note = `Estado: Estado del espacio. Los valores aceptados son: ${estadosEspacio.join(", ")}`;
    worksheet.getCell("C1").note = `Clasificación: Clasificación del espacio. Los valores aceptados son: ${clasificacionesEspacio.join(", ")}`;
    worksheet.getCell("D1").note = `Uso: Uso del espacio. Los valores aceptados son: ${usosEspacio.join(", ")}`;
    worksheet.getCell("E1").note = `Tipo: Tipo del espacio. Los valores aceptados son: ${tiposEspacio.join(", ")}`;
    worksheet.getCell("F1").note = `Piso: Piso del espacio. Los valores aceptados son: ${pisosEspacio.join(", ")}`;
    worksheet.getCell("G1").note = "Capacidad: Capacidad del espacio en número de personas";
    worksheet.getCell("H1").note = "Medición (m²): Medición del espacio en metros cuadrados";

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "espacio_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2 text-black">Añadir Espacios desde CSV</h3>
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

export default AddEspacioCSV;