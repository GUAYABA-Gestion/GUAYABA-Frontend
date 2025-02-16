"use client";
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
      case "user": return "Usuario";
      case "admin": return "Administrador";
      case "maint": return "Mantenimiento";
      case "coord": return "Coordinador";
      default: return rol;
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filters.sede === "" || user.sede_nombre === filters.sede) &&
      (filters.rol === "" || user.rol === filters.rol) &&
      (filters.correo === "" || user.correo.includes(filters.correo)) &&
      (filters.es_manual === "" || user.es_manual === (filters.es_manual === "true"))
    );
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Roles</h1>

      {/* Filtros */}
      <div className="mt-4 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Filtrar por correo"
            value={filters.correo}
            onChange={(e) => onFilterChange("correo", e.target.value)}
            className="p-2 border rounded text-black"
          />
          <select
            value={filters.rol}
            onChange={(e) => onFilterChange("rol", e.target.value)}
            className="p-2 border rounded text-black"
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
            className="p-2 border rounded text-black"
          >
            <option value="">Todas las sedes</option>
            {sedes.map((sede) => (
              <option key={sede.id_sede} value={sede.nombre}>{sede.nombre}</option>
            ))}
          </select>
          <select
            value={filters.es_manual}
            onChange={(e) => onFilterChange("es_manual", e.target.value)}
            className="p-2 border rounded text-black"
          >
            <option value="">Todos</option>
            <option value="true">Añadidos manualmente</option>
            <option value="false">Registrados en el sistema</option>
          </select>
          <button
            onClick={resetFilters}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300"
          >
            Reiniciar Filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-[#80BA7F] text-white">
              <th className="border border-gray-300 p-2 w-1/4">Correo</th>
              <th className="border border-gray-300 p-2 w-1/4">Rol</th>
              <th className="border border-gray-300 p-2 w-1/4">Sede</th>
              <th className="border border-gray-300 p-2 w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id_persona}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${
                  user.es_manual ? "border-l-4 border-red-500" : ""
                }`}
              >
                <td className="border border-gray-300 p-2 text-black">{user.correo}</td>
                <td className="border border-gray-300 p-2 text-black">{getRolCompleto(user.rol)}</td>
                <td className="border border-gray-300 p-2 text-black">{user.sede_nombre}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => onUserClick(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="flex items-center px-4 py-2 text-black">
          Página {currentPage} de {Math.ceil(filteredUsers.length / itemsPerPage)}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
          className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default UserTable;