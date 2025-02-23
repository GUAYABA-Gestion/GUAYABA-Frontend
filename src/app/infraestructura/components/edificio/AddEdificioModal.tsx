"use client";
import { useState } from "react";
import AddEdificioManual from "./AddEdificioManual";
import AddEdificioCSV from "./AddEdificioCSV";
import { Edificio, Sede, Municipio, User } from "../../../../types/api";

interface AddEdificioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdificiosAdded: (newEdificios: Edificio[]) => void;
  sedes: Sede[];
  municipios: Municipio[];
  coordinadores: User[];
  rolSimulado: string;
  idSede: number | null;
}

const AddEdificioModal: React.FC<AddEdificioModalProps> = ({
  isOpen,
  onClose,
  onEdificiosAdded,
  sedes,
  municipios,
  coordinadores,
  rolSimulado,
  idSede,
}) => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [showCsvInfo, setShowCsvInfo] = useState(false);

  const handleEdificiosParsed = (parsedEdificios: Edificio[]) => {
    setEdificios([...edificios, ...parsedEdificios]);
  };

  const handleEdificiosAdded = (newEdificios: Edificio[]) => {
    onEdificiosAdded(newEdificios);
    setEdificios([]);
  };

  const handleClose = () => {
    setEdificios([]);
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
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Edificios</h2>

        <AddEdificioManual
          onClose={handleClose}
          onEdificiosAdded={handleEdificiosAdded}
          edificios={edificios}
          setEdificios={setEdificios}
          sedes={sedes}
          coordinadores={coordinadores}
          rolSimulado={rolSimulado}
          idSede={idSede}
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
          <AddEdificioCSV
            onEdificiosParsed={handleEdificiosParsed}
            onClose={handleClose}
            sedes={sedes}
            coordinadores={coordinadores}
            rolSimulado={rolSimulado}
            idSede={idSede}
          />
        )}
      </div>
    </div>
  );
};

export default AddEdificioModal;