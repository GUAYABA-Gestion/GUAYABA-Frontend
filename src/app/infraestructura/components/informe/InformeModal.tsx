"use client";
import { useState, useEffect } from "react";
import { Sede, Espacio, Mantenimiento } from "../../../../types/api";
import { fetchEspacios, fetchMantenimientos } from "../../api/auth/InformeActions";
import { Chart } from "react-chartjs-2";
import jsPDF from "jspdf";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSedes: number[];
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, selectedSedes }) => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        const espaciosData = await fetchEspacios(selectedSedes);
        const mantenimientosData = await fetchMantenimientos(selectedSedes);
        setEspacios(espaciosData);
        setMantenimientos(mantenimientosData);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [isOpen, selectedSedes]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Informe de Espacios y Mantenimientos", 10, 10);
    // Agregar más contenido al PDF
    doc.save("informe.pdf");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Detalles de Espacios y Mantenimientos</h2>
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Filtrar por Prioridad</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mt-1 p-2 border rounded w-full text-black"
              >
                <option value="">Todas las Prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold text-black">Espacios</h3>
                <ul>
                  {espacios.map((espacio) => (
                    <li key={espacio.id_espacio}>{espacio.nombre}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Mantenimientos</h3>
                <ul>
                  {mantenimientos
                    .filter((mantenimiento) => !filter || mantenimiento.prioridad === filter)
                    .map((mantenimiento) => (
                      <li key={mantenimiento.id_mantenimiento}>
                        {mantenimiento.nombre} - {mantenimiento.prioridad}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <Chart
                type="bar"
                data={{
                  labels: ["Alta", "Media", "Baja"],
                  datasets: [
                    {
                      label: "Mantenimientos",
                      data: [
                        mantenimientos.filter((m) => m.prioridad === "alta").length,
                        mantenimientos.filter((m) => m.prioridad === "media").length,
                        mantenimientos.filter((m) => m.prioridad === "baja").length,
                      ],
                      backgroundColor: ["#ff6384", "#ff9f40", "#ffcd56"],
                    },
                  ],
                }}
              />
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