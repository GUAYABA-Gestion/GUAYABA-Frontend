"use client";
import { useEffect, useState } from "react";
import { Sede, Espacio, Edificio } from "../../../types/api";
import { fetchEventosByEspacios } from "../../api/EventoActions";
import { fetchEspaciosByEdificios } from "../../api/EspacioActions";
import { Footer, Header } from "../../../../components";
import { Chart } from "chart.js";
import { fetchSedes } from "@/app/api/SedeActions";



interface EdificioUsage {
  nombre: string;
  usage: number;
}

interface SedeInformation {
  nombre: string;
  edificioInformation: EdificioUsage[];
}


const InformePage: React.FC = () => {
  const [edificiosUsage, setEdificioUsage] = useState<EdificioUsage[]>([]);
  const [sedeInformation, setSedeInformation] = useState<SedeInformation[]>([]);
  const informeData = JSON.parse(localStorage.getItem("informeData") || "{}");
  const { selectedSedes, filteredEdificios, rolSimulado } = informeData;

  

  useEffect( () => {
    const fetchData = async () => {
      const sedesMap = new Map<number, SedeInformation>();
      const sedesData = await fetchSedes();
      calculateUsePercentage(filteredEdificios);
      filteredEdificios.forEach((edificio: Edificio) => {
        const sedeId = edificio.id_sede;
        const sedeNombre = sedesData.map((sede: Sede) => sede.id_sede === edificio.id_sede);
        const edificioInfo = edificiosUsage.find((usage) => usage.nombre === edificio.nombre);

        if (!sedesMap.has(sedeId)) {
          sedesMap.set(sedeId, {nombre: sedeNombre, edificioInformation: []});
        }
        if (edificioInfo) {
          sedesMap.get(sedeId)?.edificioInformation.push()
        }
      });
        
      };
    
    // Verificar si los datos necesarios están presentes
    if (!selectedSedes || !filteredEdificios || !rolSimulado) {
      window.location.href = "/infraestructura"; // Redirigir si no hay datos
    } else {
      fetchData();
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

    filteredEdificios.forEach((edificio: Edificio) => {
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
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Informe de Uso de Edificios</h1>
      <button
        onClick={generatePDF}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Descargar Informe en PDF
      </button>
      <div id="contenedorchart">
        
      </div>
      <Footer />
    </div>
  );
};

export default InformePage;