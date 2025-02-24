"use client";
import { useState } from "react";
import { User, Sede } from "../../../types/api";

interface UserTableProps {
  users: User[];
  sedes: Sede[];
  currentPage: number;
  itemsPerPage: number;
  filters: {
    sede: string;
    rol: string;
    correo: string;
    es_manual: string;
  };
  onPageChange: (page: number) => void;
  onUserClick: (user: User) => void;
  onFilterChange: (filter: string, value: string) => void;
  resetFilters: () => void;
}

const UserTable = ({
  users,
  sedes,
  currentPage,
  itemsPerPage,
  filters,
  onPageChange,
  onUserClick,
  onFilterChange,
  resetFilters,
}: UserTableProps) => {
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

  const filteredUsers = users.filter((user) => {
    return (
      (filters.sede === "" || user.id_sede?.toString() === filters.sede) &&
      (filters.rol === "" || user.rol === filters.rol) &&
      (filters.correo === "" || user.correo.includes(filters.correo)) &&
      (filters.es_manual === "" ||
        user.es_manual === (filters.es_manual === "true"))
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Tabla */}
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">Correo</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Rol</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Sede</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id_persona}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${
                      user.es_manual ? "border-l-4 border-red-500" : ""
                    }`}
                  >
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {user.correo}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {getRolCompleto(user.rol)}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {getSedeNombre(user.id_sede)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => onUserClick(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={4} 
                    className="border border-gray-300 p-2 text-center text-gray-600 text-sm"
                  >
                    No hay personas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Paginación */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded text-sm ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;