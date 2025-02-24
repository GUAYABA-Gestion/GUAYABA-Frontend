"use client";
import React from "react";
import ExcelJS from "exceljs";
import { User, Sede } from "../../../types/api";

interface UserExcelExportButtonProps {
  users: User[];
  sedes: Sede[];
  filters: {
    sede: string;
    rol: string;
    correo: string;
    es_manual: string;
  };
}

const UserExcelExportButton: React.FC<UserExcelExportButtonProps> = ({ users, sedes, filters }) => {
  const getRolCompleto = (rol: string) => {
    switch (rol) {
      case "user":
        return "Usuario";
      case "admin":
        return "Administrador";
      case "maint":
        return "Mantenimiento";
      case "coord":
        return "Coordinador";
      default:
        return rol;
    }
  };

  const getSedeNombre = (id_sede: number | undefined) => {
    const sede = sedes.find((s) => s.id_sede === id_sede);
    return sede ? sede.nombre : "Sin sede";
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Teléfono", key: "telefono", width: 15 },
      { header: "Rol", key: "rol", width: 20 },
      { header: "Detalles", key: "detalles", width: 30 },
      { header: "Sede", key: "sede", width: 30 },
      { header: "Es Manual", key: "es_manual", width: 10 },
    ];

    const filteredUsers = users.filter((user) => {
      return (
        (filters.sede === "" || user.id_sede?.toString() === filters.sede) &&
        (filters.rol === "" || user.rol === filters.rol) &&
        (filters.correo === "" || user.correo.includes(filters.correo)) &&
        (filters.es_manual === "" ||
          user.es_manual === (filters.es_manual === "true"))
      );
    });

    filteredUsers.forEach((user) => {
      worksheet.addRow({
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
        rol: getRolCompleto(user.rol),
        detalles: user.detalles,
        sede: getSedeNombre(user.id_sede),
        es_manual: user.es_manual ? "Sí" : "No",
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

    const fileName = `usuarios_${filtersString}_${date}.xlsx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownloadExcel}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm w-full md:w-auto"
    >
      Descargar tabla con filtros aplicados
    </button>
  );
};

export default UserExcelExportButton;