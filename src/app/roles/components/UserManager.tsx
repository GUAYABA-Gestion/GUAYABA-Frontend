"use client";
import { useState } from "react";
import { User, Sede } from "../../../types/api";
import UserTable from "./UserTable";
import UserDetailsModal from "./UserDetailsModal";
import AddUserModal from "./AddUserModal";

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
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleUsersAdded = (newUsers: User[]) => {
    onUsersUpdated([...users, ...newUsers]);
  };

  const handleSaveUser = (updatedUser: User) => {
    const updatedUsers = users.map((user) =>
      user.id_persona === updatedUser.id_persona ? updatedUser : user
    );
    onUsersUpdated(updatedUsers);
    setSelectedUser(updatedUser);
  };

  const handleDeleteUser = (id_persona: number) => {
    const updatedUsers = users.filter((user) => user.id_persona !== id_persona);
    onUsersUpdated(updatedUsers);
    setSelectedUser(null);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleResetFilters = () => {
    setFilters({ sede: "", rol: "", correo: "", es_manual: "" });
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <UserTable
        users={users}
        sedes={sedes}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        filters={filters}
        onPageChange={handlePageChange}
        onUserClick={(user) => {
          setSelectedUser(user);
          setIsUserModalOpen(true);
        }}
        onFilterChange={handleFilterChange}
        resetFilters={handleResetFilters}
        onAddUserClick={() => setIsAddUserModalOpen(true)}
      />

      <UserDetailsModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
        sedes={sedes}
        showSuccess={showSuccess}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        sedes={sedes}
        onUsersAdded={handleUsersAdded}
        showSuccessMessage={() => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }}
      />
    </div>
  );
};

export default UserManager;