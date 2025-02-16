"use client";
import { useEffect, useState } from "react";
import { useRol } from "../../../context/RolContext";
import UserTable from "./components/UserTable";
import UserDetailsModal from "./components/UserDetailsModal";
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

  // Fetch users and sedes
  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      const sedesData = await fetchSedes();
      setUsers(usersData);
      setSedes(sedesData);
    };
    fetchData();
  }, []);

  // Responsive items per page
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
      
      // Actualizar ambos estados
      setUsers(users.map(user => 
        user.id_persona === updatedUser.id_persona ? updatedUser : user
      ));
      
      // Actualizar usuario seleccionado y editado
      setSelectedUser(updatedUser);
      setEditedUser(updatedUser);
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Mantener el modal abierto
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
        onFilterChange={(filter, value) => setFilters(prev => ({ ...prev, [filter]: value }))}
        resetFilters={() => setFilters({ sede: "", rol: "", correo: "", es_manual: "" })}
      />

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
    </>
  );
};

export default AdminDashboard;