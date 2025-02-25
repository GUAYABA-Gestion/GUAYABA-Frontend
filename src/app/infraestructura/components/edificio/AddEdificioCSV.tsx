"use client";
import { useState } from "react";
import Papa from "papaparse";
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
        const parsedEdificios: Edificio[] = result.data.map((row: any) => {
          const correoTitular = row.correo_titular || "";
          const titular = coordinadores.find(coordinador => coordinador.correo === correoTitular);
      
          return {
            id_edificio: 0,
            nombre: row.nombre || "",
            dirección: row.dirección || "",
            id_sede: rolSimulado === "coord" ? idSede ?? 0 : Number(row.id_sede) || 0,
            categoría: row.categoría || "",
            propiedad: row.propiedad || "",
            area_terreno: Number(row.area_terreno) || 0,
            area_construida: Number(row.area_construida) || 0,
            cert_uso_suelo: row.cert_uso_suelo === "DISPONIBLE",
            id_titular: titular ? titular.id_persona : null,  // Asignar el id_titular si el correo existe
            correo_titular: correoTitular,
            nombre_sede: "",
            nombre_titular: ""
          };
        });
      
        onEdificiosParsed(parsedEdificios);
      },
      error: (err) => console.error("Error al leer CSV:", err.message),
    });
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
    worksheet.getCell("C1").note = rolSimulado === "coord" ? `ID de la sede: ${idSede}` : "ID de la sede. Los IDs de las sedes disponibles son: " + sedes.map(sede => `${sede.id_sede}: ${sede.nombre}`).join(", ");
    worksheet.getCell("D1").note = `Categoría: Categoría del edificio. Los valores aceptados son: ${categoriasEdificio.join(", ")}`;
    worksheet.getCell("E1").note = `Propiedad: Propiedad del edificio. Los valores aceptados son: ${propiedadesEdificio.join(", ")}`;
    worksheet.getCell("F1").note = "Área del terreno en metros cuadrados";
    worksheet.getCell("G1").note = "Área construida en metros cuadrados";
    worksheet.getCell("H1").note = `Cert. Uso Suelo: Puede ser ${certUsoSuelo.join(" o ")}`;
    worksheet.getCell("I1").note = "Correo Titular: Correo electrónico del titular del edificio (puede dejarse vacío)";

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edificio_template.xlsx");
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

export default AddEdificioCSV;