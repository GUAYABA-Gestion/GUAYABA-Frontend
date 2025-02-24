"use client";
import { useState } from "react";
import { User, Sede } from "../../../types/api";
import UserTable from "./UserTable";
import UserDetailsModal from "./UserDetailsModal";
import AddUserModal from "./AddUserModal";
import {
  updateUser,
  deleteUserManual,
} from "../../api/UserActions";

interface UserManagerProps {
  users: User[];
  sedes: Sede[];
  onUsersUpdated: (users: User[]) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, sedes, onUsersUpdated }) => {
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

      onUsersUpdated(
        users.map((user) =>
          user.id_persona === updatedUser.id_persona ? updatedUser : user
        )
      );

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
      onUsersUpdated(users.filter((user) => user.id_persona !== id_persona));
      setSelectedUser(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUsersAdded = (newUsers: User[]) => {
    onUsersUpdated([...users, ...newUsers]); // Agregar nuevos usuarios a la lista
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  return (
    <div className="flex-grow mt-4 p-4">
      <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Roles</h1>

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
          setCurrentPage(1); // Reset pagination to the first page
        }}
        onAddUserClick={() => setIsAddUserModalOpen(true)}
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

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)} // No mostrar mensaje de éxito al cancelar
        sedes={sedes}
        onUsersAdded={handleUsersAdded}
        showSuccessMessage={showSuccessMessage} // Pass the new prop
      />
    </div>
  );
};

export default UserManager;