"use client";
import { useState, useRef, useEffect} from "react";
import AddMantenimientoManual from "./AddMantenimientoManual";
import AddMantenimientoCSV from "./AddMantenimientoCSV";
import { Mantenimiento, User } from "../../../../types/api";

interface AddMantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMantenimientosAdded: (newMantenimientos: Mantenimiento[]) => void;
  maints: User[];
  idEspacio: number;
}

const AddMantenimientoModal: React.FC<AddMantenimientoModalProps> = ({
  isOpen,
  onClose,
  onMantenimientosAdded,
  maints,
  idEspacio,
}) => {

  const modalRef = useRef<HTMLDivElement>(null);

  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [showCsvInfo, setShowCsvInfo] = useState(false);

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

  const handleMantenimientosParsed = (parsedMantenimientos: Mantenimiento[]) => {
    setMantenimientos([...mantenimientos, ...parsedMantenimientos]);
  };

  const handleMantenimientosAdded = (newMantenimientos: Mantenimiento[]) => {
    onMantenimientosAdded(newMantenimientos);
    setMantenimientos([]);
  };

  const handleClose = () => {
    setMantenimientos([]);
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
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Mantenimientos</h2>

        <AddMantenimientoManual
          onClose={handleClose}
          onMantenimientosAdded={handleMantenimientosAdded}
          mantenimientos={mantenimientos}
          setMantenimientos={setMantenimientos}
          maints={maints}
          idEspacio={idEspacio}
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
          <AddMantenimientoCSV
            onMantenimientosParsed={handleMantenimientosParsed}
            onClose={handleClose}
            maints={maints}
            idEspacio={idEspacio}
          />
        )}
      </div>
    </div>
  );
};

export default AddMantenimientoModal;