"use client";
import { useEffect, useState } from "react";
import { useRol } from "../../../context/RolContext";
import UserTable from "./components/UserTable";
import UserDetailsModal from "./components/UserDetailsModal";
import AddUserModal from "./components/AddUserModal";
import { User, Sede } from "../../types/api";
import { fetchUsers, fetchSedes, updateUser, deleteUserManual } from "./components/UserActions";

const AdminDashboard = () => {
  const { rolSimulado } = useRol();
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [filters, setFilters] = useState({
    sede: "",
    rol: "",
    correo: "",
    es_manual: "",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // Estado para el modal

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      const sedesData = await fetchSedes();
      setUsers(usersData);
      setSedes(sedesData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEditField = (field: keyof User, value: string) => {
    editedUser && setEditedUser({ ...editedUser, [field]: value });
  };

  const handleSaveChanges = async () => {
    if (!editedUser) return;
  
    if (editedUser.telefono && !/^\d{10}$/.test(editedUser.telefono)) {
      alert("El teléfono debe tener 10 dígitos");
      return;
    }
  
    try {
      const updatedUser = await updateUser(editedUser);

      setUsers(users.map(user => 
        user.id_persona === updatedUser.id_persona ? updatedUser : user
      ));
      
      setSelectedUser(updatedUser);
      setEditedUser(updatedUser);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditMode(false);
  
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteUser = async (id_persona: number) => {
    try {
      await deleteUserManual(id_persona);
      setUsers(users.filter(user => user.id_persona !== id_persona));
      setSelectedUser(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUsersAdded = (newUsers: User[]) => {
    setUsers([...users, ...newUsers]); // Agregar nuevos usuarios a la lista
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Resetear la paginación a la primera página
  };

  if (rolSimulado !== "admin") {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-black">Acceso Restringido</h2>
        <p className="text-gray-600">Esta vista solo está disponible para administradores.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Roles</h1>

        {/* Filtros */}
        <div className="mt-4 space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filtrar por correo"
              value={filters.correo}
              onChange={(e) => handleFilterChange("correo", e.target.value)}
              className="p-2 border rounded text-black"
            />
            <select
              value={filters.rol}
              onChange={(e) => handleFilterChange("rol", e.target.value)}
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
              onChange={(e) => handleFilterChange("sede", e.target.value)}
              className="p-2 border rounded text-black"
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
              onChange={(e) => handleFilterChange("es_manual", e.target.value)}
              className="p-2 border rounded text-black"
            >
              <option value="">Todos</option>
              <option value="true">Añadidos manualmente</option>
              <option value="false">Registrados en el sistema</option>
            </select>
            <button
              onClick={() => {
                setFilters({ sede: "", rol: "", correo: "", es_manual: "" });
                setCurrentPage(1); // Resetear la paginación a la primera página
              }}
              className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300"
            >
              Reiniciar Filtros
            </button>
          </div>
        </div>

        <button onClick={() => setIsAddUserModalOpen(true)} className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300">
          + Añadir Usuarios
        </button>

        {/* Tabla */}
        <div className="mt-6">
          {users.length > 0 ? (
            <UserTable
              users={users}
              sedes={sedes}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              filters={filters}
              onPageChange={setCurrentPage}
              onUserClick={(user) => {
                setSelectedUser(user);
                setEditedUser(user);
                setEditMode(false);
              }}
              onFilterChange={handleFilterChange}
              resetFilters={() => {
                setFilters({ sede: "", rol: "", correo: "", es_manual: "" });
                setCurrentPage(1); // Resetear la paginación a la primera página
              }}
            />
          ) : (
            <div className="mt-4 text-center text-gray-600">No hay registros para mostrar.</div>
          )}
        </div>

        {showSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            ¡Usuarios añadidos correctamente!
          </div>
        )}
      </div>

      <UserDetailsModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={handleSaveChanges}
        onDelete={handleDeleteUser}
        editMode={editMode}
        setEditMode={setEditMode}
        editedUser={editedUser}
        handleEditField={handleEditField}
        sedes={sedes}
        showSuccess={showSuccess} 
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)} // No mostrar mensaje de éxito al cancelar
        sedes={sedes}
        onUsersAdded={handleUsersAdded}
        showSuccessMessage={showSuccessMessage} // Pass the new prop
      />
    </>
  );
};

export default AdminDashboard;