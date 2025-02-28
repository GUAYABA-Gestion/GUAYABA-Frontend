"use client";

import { useState, useEffect, useRef } from "react";
import { Evento, Programa } from "../../../../types/api";
import AddEventoManual from "./AddEventoManual";
import AddEventoCSV from "./AddEventoCSV";

interface AddEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventosAdded: (newEventos: Evento[]) => void;
  programas: Programa[];
  idEspacio: number;
}

const AddEventoModal: React.FC<AddEventoModalProps> = ({
  isOpen,
  onClose,
  onEventosAdded,
  programas,
  idEspacio,
}) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showCsvInfo, setShowCsvInfo] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleEventosParsed = (parsedEventos: Evento[]) => {
    setEventos([...eventos, ...parsedEventos]);
  };

  const handleEventosAdded = (newEventos: Evento[]) => {
    onEventosAdded(newEventos);
    setEventos([]);
  };

  const handleClose = () => {
    setEventos([]);
    onClose();
  };

  const handleToggleCsvInfo = () => {
    setShowCsvInfo(!showCsvInfo);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${
        isOpen ? "visible" : "invisible"
      } z-50`}
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Añadir Eventos</h2>

        <AddEventoManual
          onClose={handleClose}
          onEventosAdded={handleEventosAdded}
          eventos={eventos}
          setEventos={setEventos}
          programas={programas}
          idEspacio={idEspacio}
        />

        <div className="mt-4">
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              checked={showCsvInfo}
              onChange={handleToggleCsvInfo}
              className="mr-2"
            />
            Añadir desde CSV
          </label>
          {showCsvInfo && (
            <AddEventoCSV
              onClose={handleClose}
              onEventosParsed={handleEventosParsed}
              programas={programas}
              idEspacio={idEspacio}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default AddEventoModal;