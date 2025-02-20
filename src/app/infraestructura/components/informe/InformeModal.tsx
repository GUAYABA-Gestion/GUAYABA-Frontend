"use client";
import { useState, useEffect } from "react";
import { Sede, Espacio, Mantenimiento, Evento } from "../../../../types/api";
import { fetchEspaciosByEdificios } from "../../../api/auth/EspacioActions";
import { fetchMantenimientosByEspacios } from "../../../api/auth/MantenimientoActions";
import { fetchEventosByEspacios } from "../../../api/auth/EventoActions";
import jsPDF from "jspdf";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSedes: number[];
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, selectedSedes }) => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        const edificios = selectedSedes;
        const espaciosData = await fetchEspaciosByEdificios(edificios);
        setEspacios(espaciosData);

        const ids_espacios = espaciosData.map((espacio) => espacio.id_espacio);
        const mantenimientosData = await fetchMantenimientosByEspacios(ids_espacios);
        setMantenimientos(mantenimientosData);

        const eventosData = await fetchEventosByEspacios(ids_espacios);
        setEventos(eventosData);

        setIsLoading(false);
      };
      fetchData();
    }
  }, [isOpen, selectedSedes]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Informe de Espacios, Mantenimientos y Eventos", 10, 10);
    // Agregar más contenido al PDF
    doc.save("informe.pdf");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Detalles de Espacios, Mantenimientos y Eventos</h2>
        {isLoading ? (
          <p className="text-black">Cargando...</p>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">Espacios</h3>
              <pre className="text-black">{JSON.stringify(espacios, null, 2)}</pre>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">Mantenimientos</h3>
              <pre className="text-black">{JSON.stringify(mantenimientos, null, 2)}</pre>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">Eventos</h3>
              <pre className="text-black">{JSON.stringify(eventos, null, 2)}</pre>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Descargar PDF
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsModal;