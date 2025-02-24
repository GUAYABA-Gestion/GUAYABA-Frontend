"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sede, Espacio, Edificio } from "../../../types/api";
import { fetchEventosByEspacios } from "../../api/EventoActions";
import { fetchEspaciosByEdificios } from "../../api/EspacioActions";
import { Footer, Header } from "../../../../components";


interface EdificioUsage {
  nombre: string;
  usage: number;
}


const InformePage: React.FC = () => {
  const [edificioUsage, setEdificioUsage] = useState<EdificioUsage[]>([]);
  const informeData = JSON.parse(localStorage.getItem("informeData") || "{}");
  const { selectedSedes, filteredEdificios, rolSimulado } = informeData;

  useEffect(() => {
    // Verificar si los datos necesarios están presentes
    if (!selectedSedes || !filteredEdificios || !rolSimulado) {
      window.location.href = "/infraestructura"; // Redirigir si no hay datos
    } else {
      calculateUsePercentage(filteredEdificios);
    }

    localStorage.removeItem("informeData");
  }, []);

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

  const generatePDF = async () => {
    // Lógica para generar el PDF
    // (igual que en el código anterior)
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Informe de Uso de Edificios</h1>
      <div id="contenedorchart">
        {edificioUsage.map((edificio) => (
          <div key={edificio.nombre} className="mb-4">
            <span className="mr-4">{edificio.nombre}</span>
            <div
              style={{
                width: `${edificio.usage}%`,
                height: "20px",
                backgroundColor: "rgba(11, 241, 88, 0.8)",
                borderRadius: "4px",
              }}
            ></div>
          </div>
        ))}
      </div>
      <button
        onClick={generatePDF}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Descargar Informe en PDF
      </button>
    </div>
  );
};

export default InformePage;