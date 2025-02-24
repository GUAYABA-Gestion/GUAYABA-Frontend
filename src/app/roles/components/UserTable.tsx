"use client";
import { User, Sede } from "../../../types/api";
import UserExcelExportButton from "./UserExcelExportButton";

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
  onAddUserClick: () => void;
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
  onAddUserClick,
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
    <div className="p-4 bg-gray-50">
      {/* Filtros y botones */}
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por correo"
            value={filters.correo}
            onChange={(e) => onFilterChange("correo", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
          <select
            value={filters.rol}
            onChange={(e) => onFilterChange("rol", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="coord">Coordinador</option>
            <option value="maint">Mantenimiento</option>
            <option value="user">Usuario</option>
          </select>
          <select
            value={filters.sede}
            onChange={(e) => onFilterChange("sede", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((sede) => (
              <option key={sede.id_sede} value={sede.id_sede}>
                {sede.nombre}
              </option>
            ))}
          </select>
          <select
            value={filters.es_manual}
            onChange={(e) => onFilterChange("es_manual", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Todos</option>
            <option value="true">Añadidos manualmente</option>
            <option value="false">Registrados en el sistema</option>
          </select>
          <button
            onClick={resetFilters}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
          >
            Reiniciar Filtros
          </button>
          <button
            onClick={onAddUserClick}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300 text-sm w-full md:w-auto"
          >
            + Añadir Usuarios
          </button>
          <UserExcelExportButton users={users} sedes={sedes} filters={filters} />
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-6 overflow-x-auto">
      <p className="text-gray-600 mb-4">
          Las filas en la tabla que tienen un borde rojo a la izquierda indican que son personas que fueron añadidas manualmente.
        </p>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
          <tr className="bg-gray-200 text-black">
              <th
                colSpan={4}
                className="border bg-[#80BA7F] text-white px-4 py-2 text-lg font-semibold"
              >
                Tabla de Personas
              </th>
            </tr>
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