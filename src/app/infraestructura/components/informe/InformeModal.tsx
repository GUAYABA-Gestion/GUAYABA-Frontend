"use client";
import { Sede } from "../../../../types/api";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSedes: number[];
  rolSimulado: string; // Añadir el rol simulado
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  selectedSedes,
  rolSimulado,
}) => {
  if (!isOpen) return null;

  const generateReport = () => {
    if (rolSimulado === "admin") {
      // Generar informe para admin
      console.log("Generando informe para admin...");
    } else if (rolSimulado === "coord") {
      // Generar informe para coordinador
      console.log("Generando informe para coordinador...");
    } else if (rolSimulado === "maint") {
      // Generar informe para mantenimiento
      console.log("Generando informe para mantenimiento...");
    } else {
      // Generar informe para otros roles
      console.log("Generando informe para otros roles...");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Detalles del Informe</h2>
        <p className="mb-4">
          Aquí puedes generar un informe detallado de las sedes seleccionadas.
        </p>
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generar Informe
        </button>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DetailsModal;