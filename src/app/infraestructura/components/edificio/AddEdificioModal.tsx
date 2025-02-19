"use client";
import { useState, useEffect } from "react";
import AddEdificioManual from "./AddEdificioManual";
import AddEdificioCSV from "./AddEdificioCSV";
import { Sede, Edificio, User } from "../../../../types/api";
import { fetchUsers } from "../../../api/auth/UserActions";

interface AddEdificioModalProps {
  isOpen: boolean;
  onClose: () => void;
  sedes: Sede[];
  onEdificiosAdded: (newEdificios: Edificio[]) => void;
  showSuccessMessage: () => void;
}

const AddEdificioModal: React.FC<AddEdificioModalProps> = ({ isOpen, onClose, sedes, onEdificiosAdded, showSuccessMessage }) => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCsvInfo, setShowCsvInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const handleEdificiosAdded = (newEdificios: Edificio[]) => {
    setEdificios([...edificios, ...newEdificios]);
    onEdificiosAdded(newEdificios);
  };

  const handleClose = () => {
    setEdificios([]);
    setError(null);
    onClose();
  };

  const handleToggleCsvInfo = () => {
    setShowCsvInfo(!showCsvInfo);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${isOpen ? "visible" : "invisible"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Edificios</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <AddEdificioManual
          isOpen={isOpen}
          onClose={handleClose}
          sedes={sedes}
          onEdificiosAdded={handleEdificiosAdded}
          showSuccessMessage={showSuccessMessage}
          edificios={edificios}
          setEdificios={setEdificios}
          users={users}
        />

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCsvInfo}
              onChange={handleToggleCsvInfo}
              className="mr-2"
            />
            <span className="text-black">Mostrar opciones de carga por CSV</span>
          </label>
        </div>

        {showCsvInfo && (
          <AddEdificioCSV
            sedes={sedes}
            onEdificiosAdded={handleEdificiosAdded}
            showSuccessMessage={showSuccessMessage}
            onClose={handleClose}
            edificios={edificios}
            setEdificios={setEdificios}
            users={users}
          />
        )}
      </div>
    </div>
  );
};

export default AddEdificioModal;