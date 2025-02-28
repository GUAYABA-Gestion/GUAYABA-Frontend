"use client";
import { useState } from "react";
import AddEspacioManual from "./AddEspacioManual";
import AddEspacioCSV from "./AddEspacioCSV";
import { Espacio } from "../../../../types/api";

interface AddEspacioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEspaciosAdded: (newEspacios: Espacio[]) => void;
  idEdificio: number; // Añadir idEdificio como prop
}

const AddEspacioModal: React.FC<AddEspacioModalProps> = ({
  isOpen,
  onClose,
  onEspaciosAdded,
  idEdificio,
}) => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [showCsvInfo, setShowCsvInfo] = useState(false);

  const handleEspaciosParsed = (parsedEspacios: Espacio[]) => {
    setEspacios([...espacios, ...parsedEspacios]);
  };

  const handleEspaciosAdded = (newEspacios: Espacio[]) => {
    onEspaciosAdded(newEspacios);
    setEspacios([]);
  };

  const handleClose = () => {
    setEspacios([]);
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Espacios</h2>

        <AddEspacioManual
          isOpen={isOpen}
          onClose={handleClose}
          onEspaciosAdded={handleEspaciosAdded}
          espacios={espacios}
          setEspacios={setEspacios}
          idEdificio={idEdificio} // Pasar idEdificio al componente
        />

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCsvInfo}
              onChange={handleToggleCsvInfo}
              className="mr-2"
            />
            <span className="text-black">
              Mostrar opciones de carga por CSV
            </span>
          </label>
        </div>

        {showCsvInfo && (
          <AddEspacioCSV
            onEspaciosParsed={handleEspaciosParsed}
            onClose={handleClose}
            idEdificio={idEdificio} // Pasar idEdificio al componente
          />
        )}
      </div>
    </div>
  );
};

export default AddEspacioModal;