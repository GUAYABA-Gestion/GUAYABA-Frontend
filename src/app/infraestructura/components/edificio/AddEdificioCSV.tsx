"use client";

import { useState } from "react";
import ExcelJS from "exceljs";
import { Edificio, Sede, User } from "../../../../types/api";
import { categoriasEdificio, propiedadesEdificio, certUsoSuelo } from "../../../api/desplegableValues";

interface AddEdificioCSVProps {
  onEdificiosParsed: (parsedEdificios: Edificio[]) => void;
  onClose: () => void;
  sedes: Sede[];
  coordinadores: User[];
  rolSimulado: string;
  idSede: number | null;
}

const AddEdificioCSV: React.FC<AddEdificioCSVProps> = ({
  onEdificiosParsed,
  onClose,
  sedes,
  coordinadores,
  rolSimulado,
  idSede,
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

      const parsedEdificios: Edificio[] = rows.slice(2).map((row: any) => {
        const correoTitular = row[headers.indexOf("correo_titular")] || "";
        const titular = coordinadores.find(coordinador => coordinador.correo === correoTitular);

        return {
          id_edificio: 0,
          nombre: row[headers.indexOf("nombre")] || "",
          dirección: row[headers.indexOf("dirección")] || "",
          id_sede: rolSimulado === "coord" ? idSede ?? 0 : Number(row[headers.indexOf("id_sede")]) || 0,
          categoría: row[headers.indexOf("categoría")] || "",
          propiedad: row[headers.indexOf("propiedad")] || "",
          area_terreno: Number(row[headers.indexOf("area_terreno")]) || 0,
          area_construida: Number(row[headers.indexOf("area_construida")]) || 0,
          cert_uso_suelo: row[headers.indexOf("cert_uso_suelo")] === "DISPONIBLE",
          id_titular: titular ? titular.id_persona : null,
          correo_titular: correoTitular,
          nombre_sede: "",
          nombre_titular: ""
        };
      });

      onEdificiosParsed(parsedEdificios);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Edificios");

    worksheet.columns = [
      { header: "nombre", key: "nombre", width: 20 },
      { header: "dirección", key: "dirección", width: 30 },
      { header: "id_sede", key: "id_sede", width: 10 },
      { header: "categoría", key: "categoría", width: 15 },
      { header: "propiedad", key: "propiedad", width: 15 },
      { header: "area_terreno", key: "area_terreno", width: 15 },
      { header: "area_construida", key: "area_construida", width: 15 },
      { header: "cert_uso_suelo", key: "cert_uso_suelo", width: 15 },
      { header: "correo_titular", key: "correo_titular", width: 25 },
    ];

    worksheet.addRow(["Edificio Ejemplo", "Dirección Ejemplo", idSede ?? 1, "CAT", "PROPIO", 1000, 800, "DISPONIBLE", "ejemplo@correo.com"]);

    worksheet.getCell("A1").note = "Nombre: Nombre del edificio";
    worksheet.getCell("B1").note = "Dirección: Dirección del edificio";
    worksheet.getCell("C1").note = "ID de la sede (ver hoja 'Valores Posibles')";
    worksheet.getCell("D1").note = "Categoría del edificio (ver hoja 'Valores Posibles')";
    worksheet.getCell("E1").note = "Propiedad del edificio (ver hoja 'Valores Posibles')";
    worksheet.getCell("F1").note = "Área del terreno en metros cuadrados";
    worksheet.getCell("G1").note = "Área construida en metros cuadrados";
    worksheet.getCell("H1").note = "Cert. Uso Suelo (ver hoja 'Valores Posibles')";
    worksheet.getCell("I1").note = "Correo Titular: Correo electrónico del titular del edificio (puede dejarse vacío)";

    // Crear una segunda hoja con los valores posibles
    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Categoría", key: "categoría", width: 20 },
      { header: "Propiedad", key: "propiedad", width: 20 },
      { header: "Cert. Uso Suelo", key: "cert_uso_suelo", width: 20 },
      { header: "ID de la Sede", key: "id_sede", width: 10 },
      { header: "Nombre de la Sede", key: "nombre_sede", width: 30 },
    ];

    const maxRows = Math.max(categoriasEdificio.length, propiedadesEdificio.length, certUsoSuelo.length, sedes.length);

    for (let i = 0; i < maxRows; i++) {
      valoresPosiblesSheet.addRow({
        categoría: categoriasEdificio[i] || "",
        propiedad: propiedadesEdificio[i] || "",
        cert_uso_suelo: certUsoSuelo[i] || "",
        id_sede: sedes[i] ? sedes[i].id_sede : "",
        nombre_sede: sedes[i] ? sedes[i].nombre : "",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edificio_template.xlsx");
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

export default AddEdificioCSV;