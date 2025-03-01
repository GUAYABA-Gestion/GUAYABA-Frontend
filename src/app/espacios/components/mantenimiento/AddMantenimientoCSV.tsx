"use client";
import { useState } from "react";
import ExcelJS from "exceljs";
import { Mantenimiento, User } from "../../../../types/api";
import {
  estadosMantenimiento,
  tiposMantenimiento,
  prioridadesMantenimiento,
  necesidadesMantenimiento,
} from "../../../api/desplegableValues";

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

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (cellValue: any) => {
    if (cellValue instanceof Date) {
      return cellValue.toISOString().split("T")[0]; // Convierte a formato YYYY-MM-DD
    }
    return formatDate(cellValue || "");
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
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
        try {
          const buffer = e.target?.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer as ArrayBuffer);
          const worksheet = workbook.getWorksheet(1);
          if (!worksheet)
            throw new Error(
              "No se pudo encontrar la hoja de cálculo en el archivo."
            );

          const rows = worksheet.getSheetValues();
          const headers = rows[1] as string[];

          const parsedMantenimientos: Mantenimiento[] = rows
            .slice(2)
            .map((row: any) => ({
              id_mantenimiento: 0,
              id_espacio: idEspacio,
              id_encargado:
                maints.find(
                  (maint) =>
                    maint.correo === row[headers.indexOf("correo_encargado")]
                )?.id_persona || null,
              tipo_contrato: row[headers.indexOf("tipo_contrato")] || "",
              tipo: tiposMantenimiento.includes(row[headers.indexOf("tipo")])
                ? row[headers.indexOf("tipo")]
                : "",
              estado: estadosMantenimiento.includes(
                row[headers.indexOf("estado")]
              )
                ? row[headers.indexOf("estado")]
                : "",
              necesidad: necesidadesMantenimiento.includes(
                row[headers.indexOf("necesidad")]
              )
                ? row[headers.indexOf("necesidad")]
                : "",
              prioridad: prioridadesMantenimiento.includes(
                row[headers.indexOf("prioridad")]
              )
                ? row[headers.indexOf("prioridad")]
                : "",
              detalle: row[headers.indexOf("detalle")] || "",
              fecha_asignacion: parseDate(row[headers.indexOf("fecha_asignacion")]),
              plazo_ideal: Number(row[headers.indexOf("plazo_ideal")]) || 0,
              terminado: row[headers.indexOf("terminado")] === "true",
              observación: row[headers.indexOf("observación")] || "",
            }));

          onMantenimientosParsed(parsedMantenimientos);
        } catch (err) {
          setError("Error al procesar el archivo. Verifica el formato.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Error al leer el archivo.");
    }
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

    worksheet.addRow([
      "encargado@correo.com",
      "tipo_contrato",
      "tipo",
      "estado",
      "necesidad",
      "prioridad",
      "Detalle del mantenimiento",
      "12/02/2025",
      30,
      "false",
      "Observación",
    ]);

    const notas = [
      "Correo del encargado del mantenimiento (ver hoja 'Valores Posibles')",
      "Tipo de contrato del mantenimiento",
      "Tipo de mantenimiento (ver hoja 'Valores Posibles')",
      "Estado del mantenimiento (ver hoja 'Valores Posibles')",
      "Necesidad del mantenimiento (ver hoja 'Valores Posibles')",
      "Prioridad del mantenimiento (ver hoja 'Valores Posibles')",
      "Detalle del mantenimiento",
      "Fecha de asignación del mantenimiento (dd/mm/yyyy)",
      "Plazo ideal en días",
      "Indica si el mantenimiento está terminado (true/false)",
      "Observación del mantenimiento",
    ];

    notas.forEach((nota, i) => {
      worksheet.getCell(1, i + 1).note = nota;
    });

    const valoresPosiblesSheet = workbook.addWorksheet("Valores Posibles");
    valoresPosiblesSheet.columns = [
      { header: "Correo Encargado", key: "correo_encargado", width: 25 },
      { header: "Tipo de Mantenimiento", key: "tipo", width: 20 },
      { header: "Estado", key: "estado", width: 20 },
      { header: "Necesidad", key: "necesidad", width: 20 },
      { header: "Prioridad", key: "prioridad", width: 20 },
    ];

    const maxRows = Math.max(
      maints.length,
      tiposMantenimiento.length,
      estadosMantenimiento.length,
      necesidadesMantenimiento.length,
      prioridadesMantenimiento.length
    );

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
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
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
    </div>
  );
};

export default AddMantenimientoCSV;
