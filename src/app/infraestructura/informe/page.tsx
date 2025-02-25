"use client";
import { useEffect, useState } from "react";
import { Sede, Espacio, Edificio } from "../../../types/api";
import { fetchEventosByEspacios } from "../../api/EventoActions";
import { fetchEspaciosByEdificios } from "../../api/EspacioActions";
import { fetchSedes } from "../../api/SedeActions";
import { Footer, Header } from "../../../../components";
import { Chart, registerables } from "chart.js";
import { fetchMantenimientosByEspacios } from "../../api/MantenimientoActions";

Chart.register(...registerables);


interface EdificioUsage {
  nombre: string;
  usage: number;
  mantenimientoPendiente: number;
  mantenimientoEnProgreso: number;
  mantenimientoCompleto: number;
  mantenimientoInactivo: number;
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
      console.log(filteredEdificios);
      

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

    // Obtener los eventos de todos los espacios
    const eventosEdificios = await fetchEventosByEspacios(
      espaciosEdificios.map((espacio: Espacio) => espacio.id_espacio)
    );

    const mantenimientoEspacios = await fetchMantenimientosByEspacios(
      espaciosEdificios.map((espacio: Espacio) => espacio.id_espacio)
    );

    const usageData: EdificioUsage[] = [];

    edificios.forEach((edificio: Edificio) => {
      const espaciosEdificio = espaciosEdificios.filter(
        (espacio) => espacio.id_edificio === edificio.id_edificio
      );
      
      const mantenimientoEdificio = mantenimientoEspacios.filter(
        (mantenimiento) => mantenimiento.id_espacio === edificio.id_edificio
      );

      const eventosEdificio = eventosEdificios.filter((evento) =>
        espaciosEdificio.some((espacio) => espacio.id_espacio === evento.id_espacio)
      );
      const useTime = eventosEdificio.reduce((total, evento) => {
          return total + calculateEventDuration(evento.hora_inicio, evento.hora_fin);
      }, 0);
      const usePercentage = (useTime / 36) * 100;

      const mantenimientoPendiente = mantenimientoEdificio.reduce((total, mantenimiento) => {
        return mantenimiento.estado === "Pendiente" ? total + 1 : total;
      }, 0);
      const mantenimientoEnProgreso = mantenimientoEdificio.reduce((total, mantenimiento) => {
        return mantenimiento.estado === "En Progreso" ? total + 1 : total;
      }, 0);
      const mantenimientoCompleto = mantenimientoEdificio.reduce((total, mantenimiento) => {
        return mantenimiento.estado === "Completo" ? total + 1 : total;
      }, 0);
      const mantenimientoInactivo = mantenimientoEdificio.reduce((total, mantenimiento) => {
        return mantenimiento.estado === "Inactivo" ? total + 1 : total;
      }, 0);
      
      usageData.push({
        nombre: edificio.nombre, usage: usePercentage, mantenimientoPendiente: mantenimientoPendiente,
        mantenimientoEnProgreso: mantenimientoEnProgreso, mantenimientoCompleto: mantenimientoCompleto,
        mantenimientoInactivo: mantenimientoInactivo });
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
                  label: 'Porcentaje de Uso (%)',
                  data: sede.edificioInformation.map((edificio) => edificio.usage as number),
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
                    max: 100,
                    ticks: {
                      
                    }
                  }
                },
                animation: {
                  onComplete: function({chart}) {
                    this.config.data.datasets.forEach(function(dataset, i) {
                      const meta = chart.getDatasetMeta(i);
                      ctx.textAlign = 'center';
                      meta.data.forEach(function(bar, index) {
                        const data = dataset.data[index] as number;
                        console.log(data);
                        const scaleMax = chart.scales.y.max;
                        const ypos = data / scaleMax >= 0.93 ? bar.y + 20 : bar.y - 5
                        const value = (data.toFixed(2)).toString();
                        ctx.fillText(value, bar.x, ypos);
                      });
                    });
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
      <div className="flex flex-wrap justify-between mt-2 mb-2 space-y-2">
        <h1 className="text-2xl text-gray-800 font-bold mb-4">Informe de Uso de Edificios</h1>
        <button
          onClick={generatePDF}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Descargar Informe en PDF
        </button>
      </div>
      
      <div id="contenedorchart">
        {sedeInformation.map((sede, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2x1 font-bold mb-4 mx-auto text-center text-gray-700">{sede.nombre}</h2>
            <div className="w-1/2 mx-auto border-4 border-solid rounded-md">
              <canvas id={`chart-${index}`} width="600" height="300"></canvas>
            </div>

            {/* Tabla de mantenimientos */}
            <div className="mt-4 mx-48">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Mantenimientos por Edificio</h3>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#80BA7F] text-white">
                    <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Edificio</th>
                    <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Mantenimiento Pendiente</th>
                    <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Mantenimiento En Progreso</th>
                    <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Mantenimiento Completado</th>
                    <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Inactivo</th>
                  </tr>
                </thead>
                <tbody>
                  {sede.edificioInformation.map((edificio, index) => (
                    <tr
                     key={edificio.nombre}
                     className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}>
                      <td className="border border-gray-300 p-2 text-black text-sm">{edificio.nombre}</td>
                      <td className="border border-gray-300 p-2 text-black text-sm">{edificio.mantenimientoPendiente}</td>
                      <td className="border border-gray-300 p-2 text-black text-sm">{edificio.mantenimientoEnProgreso}</td>
                      <td className="border border-gray-300 p-2 text-black text-sm">{edificio.mantenimientoCompleto}</td>
                      <td className="border border-gray-300 p-2 text-black text-sm">{edificio.mantenimientoInactivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default InformePage;