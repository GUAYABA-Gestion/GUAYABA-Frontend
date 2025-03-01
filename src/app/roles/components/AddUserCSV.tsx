"use client";
import { useState } from "react";
import ExcelJS from "exceljs";
import { User, Sede } from "../../../types/api";

interface AddUserCSVProps {
  onUsersParsed: (parsedUsers: User[]) => void;
  onClose: () => void;
  sedes: Sede[];
}

const AddUserCSV: React.FC<AddUserCSVProps> = ({
  onUsersParsed,
  onClose,
  sedes,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = [".xlsx"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validExtensions.includes(fileExtension) ||
      !validMimeTypes.includes(file.type)
    ) {
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

      const parsedUsers: User[] = rows.slice(2).map((row: any) => ({
        nombre: row[headers.indexOf("nombre")] || "",
        correo: row[headers.indexOf("correo")] || "",
        telefono: row[headers.indexOf("telefono")] || "",
        rol: row[headers.indexOf("rol")] || "user",
        detalles: row[headers.indexOf("detalles")] || "",
        id_sede: Number(row[headers.indexOf("id_sede")]) || 0,
        id_persona: 0,
        sede_nombre:
          sedes.find(
            (sede) => sede.id_sede === Number(row[headers.indexOf("id_sede")])
          )?.nombre || "",
        es_manual: true,
      }));

      onUsersParsed(parsedUsers);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Usuarios");

    worksheet.columns = [
      { header: "nombre", key: "nombre", width: 20 },
      { header: "correo", key: "correo", width: 30 },
      { header: "telefono", key: "telefono", width: 15 },
      { header: "rol", key: "rol", width: 15 },
      { header: "detalles", key: "detalles", width: 30 },
      { header: "id_sede", key: "id_sede", width: 10 },
    ];

    worksheet.addRow([
      "Nombre Ejemplo",
      "ejemplo@correo.com",
      "1234567890",
      "user",
      "Detalles Ejemplo",
      1,
    ]);

    worksheet.getCell("A1").note = "Nombre: Nombre del usuario";
    worksheet.getCell("B1").note = "Correo: Correo electrónico del usuario";
    worksheet.getCell("C1").note = "Teléfono: Número de teléfono de 10 dígitos";
    worksheet.getCell("D1").note =
      'Rol: Puede ser "admin", "coord", "maint" o "user"';
    worksheet.getCell("E1").note =
      "Detalles: Detalles adicionales sobre el usuario";
    worksheet.getCell("F1").note =
      "ID de la sede. Los IDs de las sedes disponibles son: " +
      sedes.map((sede) => `${sede.id_sede}: ${sede.nombre}`).join(", ");

    // Crear una segunda hoja con los valores posibles
    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Rol", key: "rol", width: 20 },
      { header: "ID de la Sede", key: "id_sede", width: 10 },
      { header: "Nombre de la Sede", key: "nombre_sede", width: 30 },
    ];

    const roles = ["admin", "coord", "maint", "user"];
    const maxRows = Math.max(roles.length, sedes.length);

    for (let i = 0; i < maxRows; i++) {
      valoresPosiblesSheet.addRow({
        rol: roles[i] || "",
        id_sede: sedes[i] ? sedes[i].id_sede : "",
        nombre_sede: sedes[i] ? sedes[i].nombre : "",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "user_template.xlsx");
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
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        className="mt-4 text-black"
      />

      <button
        onClick={handleDownloadTemplate}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
      >
        Descargar Plantilla Excel
      </button>

      <div className="mt-4 text-black">
        <p>
          <b>Por favor, cargue los datos siguiendo la plantilla.</b>
        </p>
      </div>
    </div>
  );
};

export default AddUserCSV;
