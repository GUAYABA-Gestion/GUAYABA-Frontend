"use client";
import { useRef, useState, useEffect } from "react";
import AddUserManual from "./AddUserManual";
import AddUserCSV from "./AddUserCSV";
import { Sede, User } from "../../../types/api";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersAdded: (newUsers: User[]) => void;
  sedes: Sede[];
  users: User[]; // Recibir los usuarios filtrados
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onUsersAdded,
  sedes,
  users, // Recibir los usuarios filtrados
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCsvInfo, setShowCsvInfo] = useState(false);
  const [newUsers, setNewUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleUsersParsed = (parsedUsers: User[]) => {
    setNewUsers([...newUsers, ...parsedUsers]);
  };

  const handleUsersAdded = (addedUsers: User[]) => {
    onUsersAdded(addedUsers);
    setNewUsers([]);
  };

  const handleClose = () => {
    setNewUsers([]);
    onClose();
  };

  const handleToggleCsvInfo = () => {
    setShowCsvInfo(!showCsvInfo);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Usuarios</h2>

        <AddUserManual
          onClose={handleClose}
          onUsersAdded={handleUsersAdded}
          users={newUsers}
          setUsers={setNewUsers}
          sedes={sedes}
        />

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCsvInfo}
              onChange={handleToggleCsvInfo}
              className="mr-2"
            />
            <span className="text-black text-sm">
              Mostrar opciones de carga por archivo
            </span>
          </label>
        </div>

        {showCsvInfo && (
          <AddUserCSV
            onUsersParsed={handleUsersParsed}
            onClose={handleClose}
            sedes={sedes}
          />
        )}
      </div>
    </div>
  );
};

export default AddUserModal;