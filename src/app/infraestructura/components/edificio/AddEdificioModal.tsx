"use client";
import { useState } from "react";
import AddEdificioManual from "./AddEdificioManual";
import AddEdificioCSV from "./AddEdificioCSV";
import { Edificio, Sede, User } from "../../../../types/api";

interface AddEdificioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdificiosAdded: (newEdificios: Edificio[]) => void;
  sedes: Sede[];
  coordinadores: User[]; // Añadir coordinadores como prop 
  showSuccessMessage: () => void;
  rolSimulado: string; // Añadir rolSimulado como prop
  idSede: number | null; // Añadir idSede como prop
}

const AddEdificioModal: React.FC<AddEdificioModalProps> = ({ isOpen, onClose, onEdificiosAdded, sedes, coordinadores, showSuccessMessage, rolSimulado, idSede }) => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [showCsvInfo, setShowCsvInfo] = useState(false);

  const handleEdificiosAdded = (newEdificios: Edificio[]) => {
    setEdificios([...edificios, ...newEdificios]);
    onEdificiosAdded(newEdificios);
  };

  const handleClose = () => {
    setEdificios([]);
    onClose();
  };

  const handleToggleCsvInfo = () => {
    setShowCsvInfo(!showCsvInfo);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${isOpen ? "visible" : "invisible"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Edificios</h2>

        <AddEdificioManual
          isOpen={isOpen}
          onClose={handleClose}
          onEdificiosAdded={handleEdificiosAdded}
          edificios={edificios}
          setEdificios={setEdificios}
          sedes={sedes}
          rolSimulado={rolSimulado} // Pasar rolSimulado al componente
          idSede={idSede} // Pasar idSede al componente
          showSuccessMessage={showSuccessMessage} // Pasar showSuccessMessage al componente
          users={coordinadores} // Pasar users al componente (debes reemplazar [] con la lista de usuarios correspondiente)
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
            onEdificiosAdded={handleEdificiosAdded}
            onClose={handleClose}
            edificios={edificios}
            setEdificios={setEdificios}
            sedes={sedes}
            rolSimulado={rolSimulado} // Pasar rolSimulado al componente
            idSede={idSede} // Pasar idSede al componente
            showSuccessMessage={showSuccessMessage} // Pasar showSuccessMessage al componente
            users={coordinadores} // Pasar users al componente (debes reemplazar [] con la lista de usuarios correspondiente)
          />
        )}
      </div>
    </div>
  );
};

export default AddEdificioModal;