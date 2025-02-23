import React from "react";
import ExcelJS from "exceljs";
import { Edificio, Sede } from "../../../../types/api";

interface ExcelExportButtonProps {
  edificios: Edificio[];
  sedes: Sede[];
  filters: {
    nombre: string;
    categoria: string;
  };
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ edificios, sedes, filters }) => {
  const handleDownloadEdificios = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Edificios");

    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Dirección", key: "dirección", width: 30 },
      { header: "Sede", key: "sede", width: 20 },
      { header: "Categoría", key: "categoría", width: 15 },
      { header: "Propiedad", key: "propiedad", width: 15 },
      { header: "Área Terreno", key: "area_terreno", width: 15 },
      { header: "Área Construida", key: "area_construida", width: 15 },
      { header: "Cert. Uso Suelo", key: "cert_uso_suelo", width: 15 },
      { header: "Correo Titular", key: "correo_titular", width: 25 },
    ];

    edificios.forEach((edificio) => {
      worksheet.addRow({
        nombre: edificio.nombre,
        dirección: edificio.dirección,
        sede: sedes.find((sede) => sede.id_sede === edificio.id_sede)?.nombre || "",
        categoría: edificio.categoría,
        propiedad: edificio.propiedad,
        area_terreno: edificio.area_terreno,
        area_construida: edificio.area_construida,
        cert_uso_suelo: edificio.cert_uso_suelo ? "DISPONIBLE" : "NO DISPONIBLE",
        correo_titular: edificio.correo_titular,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const date = new Date().toISOString().split("T")[0];
    const filtersString = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}-${value}`)
      .join("_");

    const fileName = `edificios_${filtersString}_${date}.xlsx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownloadEdificios}
      className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 text-sm w-full md:w-auto"
    >
      Descargar Excel
    </button>
  );
};

export default ExcelExportButton;