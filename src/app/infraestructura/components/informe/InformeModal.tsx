"use client";
import { useEffect, useRef, useState } from "react";
import { Sede, Espacio, Edificio } from "../../../../types/api";
import { fetchEventosByEspacios } from "../../../api/EventoActions";
import { fetchEspaciosByEdificios } from "../../../api/EspacioActions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSedes: number[];
  filteredEdificios: Edificio[];
  rolSimulado: string; // Añadir el rol simulado
}

interface EdificioUsage {
  nombre: string;
  usage: number;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  selectedSedes,
  filteredEdificios,
  rolSimulado,
}) => {
  const [edificioUsage, setEdificioUsage] = useState<EdificioUsage[]>([]); // Estado para almacenar el uso de los edificios
  const chartContainerRef = useRef<HTMLDivElement | null>(null); // Referencia para el contenedor del gráfico

  if (!isOpen) return null;

  const calculateEventDuration = (startTime: string, endTime: string): number => {
    const start = new Date('1970-01-01T' + startTime + 'Z').getTime();
    const end = new Date('1970-01-01T' + endTime + 'Z').getTime();
    return (end - start) / (1000 * 3600);
  };

  const calculateUsePercentage = async (edificios: Edificio[]) => {
    // Obtener los espacios de todos los edificios
    const espaciosEdificios = await fetchEspaciosByEdificios(
      edificios.map((edificio: Edificio) => edificio.id_edificio)
    );

    // Obtener los eventos de todos los espacios
    const eventosEdificios = await fetchEventosByEspacios(
      espaciosEdificios.map((espacio: Espacio) => espacio.id_espacio)
    );

    const usageData: EdificioUsage[] = [];

    filteredEdificios.forEach((edificio) => {
      const espaciosEdificio = espaciosEdificios.filter(
        (espacio) => espacio.id_edificio === edificio.id_edificio
      );
      const eventosEdificio = eventosEdificios.filter((evento) =>
        espaciosEdificio.some((espacio) => espacio.id_espacio === evento.id_espacio)
      );
      let useTime = eventosEdificio.reduce((total, evento) => {
        return total + calculateEventDuration(evento.hora_inicio, evento.hora_fin);
      }, 0);
      let usePercentage = (useTime / 24) * 100;
      usageData.push({ nombre: edificio.nombre, usage: usePercentage });
    });

    setEdificioUsage(usageData); // Actualizar el estado con los datos de uso
  };

  // Función para renderizar el gráfico en HTML
  const renderChartInHTML = () => {
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = ""; // Limpiar el contenedor

      const maxUsage = Math.max(...edificioUsage.map((edificio) => edificio.usage));

      edificioUsage.forEach((edificio) => {
        const barHeight = (edificio.usage / maxUsage) * 100; // Altura de la barra en porcentaje

        const barContainer = document.createElement("div");
        barContainer.style.display = "flex";
        barContainer.style.alignItems = "center";
        barContainer.style.marginBottom = "10px";

        const label = document.createElement("span");
        label.textContent = edificio.nombre;
        label.style.width = "150px";
        label.style.marginRight = "10px";

        const bar = document.createElement("div");
        bar.style.width = `${barHeight}%`;
        bar.style.height = "20px";
        bar.style.backgroundColor = "rgba(75, 192, 192, 0.8)";
        bar.style.borderRadius = "4px";

        barContainer.appendChild(label);
        barContainer.appendChild(bar);
        chartContainerRef.current?.appendChild(barContainer);
      });
    }
  };

  const generateReport = async () => {
    if (rolSimulado === "admin") {
      await calculateUsePercentage(filteredEdificios);

      console.log("Generando informe para admin...");

      // Renderizar el gráfico en HTML
      renderChartInHTML();

      // Esperar a que el gráfico se renderice completamente
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capturar el contenido del gráfico con html2canvas
      if (chartContainerRef.current) {
        chartContainerRef.current.style.display = "block";


        // Crear un nuevo documento PDF
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.html(document.getElementById("contenedorchart")!, {
          callback: function(pdf) {
            pdf.save("informe_edificios.pdf");
          }
        })
        // Descargar el PDF
      }
    } else if (rolSimulado === "coord") {
      console.log("Generando informe para coordinador...");
    } else if (rolSimulado === "maint") {
      console.log("Generando informe para mantenimiento...");
    } else {
      console.log("Generando informe para otros roles...");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div id="modal-content" className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Detalles del Informe</h2>
        <p className="mb-4">
          Aquí puedes generar un informe detallado de las sedes seleccionadas.
        </p>



        {/* Botones */}
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
        <div id="contenedorchart"
          ref={chartContainerRef}
          style={{display:"none"}}
        >
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;