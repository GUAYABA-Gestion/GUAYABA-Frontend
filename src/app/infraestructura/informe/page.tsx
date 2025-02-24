"use client";
import { useEffect, useState } from "react";
import { Sede, Espacio, Edificio } from "../../../types/api";
import { fetchEventosByEspacios } from "../../api/EventoActions";
import { fetchEspaciosByEdificios } from "../../api/EspacioActions";
import { Footer, Header } from "../../../../components";
import { Chart, registerables } from "chart.js";
import { fetchSedes } from "@/app/api/SedeActions";

Chart.register(...registerables);

interface EdificioUsage {
  nombre: string;
  usage: number;
}

interface SedeInformation {
  nombre: string;
  edificioInformation: EdificioUsage[];
}

const InformePage: React.FC = () => {
  const [sedeInformation, setSedeInformation] = useState<SedeInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const informeData = JSON.parse(localStorage.getItem("informeData") || "{}");
  const { selectedSedes, filteredEdificios, rolSimulado } = informeData;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const sedesData = await fetchSedes();
      const sedesMap = new Map<number, SedeInformation>();

      // Calcular el porcentaje de uso de los edificios
      const usageData = await calculateUsePercentage(filteredEdificios);

      // Organizar la información por sede
      filteredEdificios.forEach((edificio: Edificio) => {
        const sedeId = edificio.id_sede;
        const sedeNombre = sedesData.find((sede: Sede) => sede.id_sede === sedeId)?.nombre || "Desconocido";
        const edificioInfo = usageData.find((usage) => usage.nombre === edificio.nombre);

        if (!sedesMap.has(sedeId)) {
          sedesMap.set(sedeId, { nombre: sedeNombre, edificioInformation: [] });
        }
        if (edificioInfo) {
          sedesMap.get(sedeId)?.edificioInformation.push(edificioInfo);
        }
      });

      // Convertir el mapa a un array y actualizar el estado
      setSedeInformation(Array.from(sedesMap.values()));
      setIsLoading(false);
    };

    // Verificar si los datos necesarios están presentes
    if (!selectedSedes || !filteredEdificios || !rolSimulado) {
      window.location.href = "/infraestructura"; // Redirigir si no hay datos
    } else {
      fetchData();
    }

    localStorage.removeItem("informeData");
  }, []);

  const calculateEventDuration = (startTime: string, endTime: string): number => {
    const start = new Date('1970-01-01T' + startTime + 'Z').getTime();
    const end = new Date('1970-01-01T' + endTime + 'Z').getTime();
    const duration = (end - start) / (1000 * 3600);
    if (duration < 0) {
      return 0; // para evitar tener en cuenta eventos malformados (endtime > startTime)
    }
    return (end - start) / (1000 * 3600);
  };

  const calculateUsePercentage = async (edificios: Edificio[]) => {
    // Obtener los espacios de todos los edificios
    const espaciosEdificios = await fetchEspaciosByEdificios(
      edificios.map((edificio: Edificio) => edificio.id_edificio)
    );

    console.log(espaciosEdificios);
    // Obtener los eventos de todos los espacios
    const eventosEdificios = await fetchEventosByEspacios(
      espaciosEdificios.map((espacio: Espacio) => espacio.id_espacio)
    );
    console.log(eventosEdificios);

    const usageData: EdificioUsage[] = [];

    edificios.forEach((edificio: Edificio) => {
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

    return usageData;
  };

  const generatePDF = async () => {
    window.print();
  };

  useEffect(() => {
    if (sedeInformation.length > 0) {
      sedeInformation.forEach((sede, index) => {
        const canvas = document.getElementById(`chart-${index}`) as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Destruir el gráfico existente si hay uno
            const existingChart = Chart.getChart(canvas);
            if (existingChart) {
              existingChart.destroy();
            }

            // Crear un nuevo gráfico
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: sede.edificioInformation.map((edificio) => edificio.nombre),
                datasets: [{
                  label: 'Porcentaje de Uso',
                  data: sede.edificioInformation.map((edificio) => edificio.usage),
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }
            });
          }
        }
      });
    }
  }, [sedeInformation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <h1 className="text-2xl text-gray-800 font-bold mb-4">Informe de Uso de Edificios</h1>
      <button
        onClick={generatePDF}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Descargar Informe en PDF
      </button>
      <div id="contenedorchart">
        {sedeInformation.map((sede, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2x1 font-bold mb-4 mx-auto text-center">{sede.nombre}</h2>
            <div className="w-1/2 mx-auto">
              <canvas id={`chart-${index}`} width="400" height="200"></canvas>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default InformePage;