"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sede, Municipio, User, Edificio } from "../../types/api";
import { useRol } from "../../../context/RolContext";
import { fetchSedes } from "../api/SedeActions";
import { fetchMunicipios } from "../api/UtilsActions";
import { fetchUsers } from "../api/UserActions";
import { fetchEdificios } from "../api/EdificioActions";
import { Header } from "../../../components";
import SedeManager from "./components/sede/SedeManager";
import EdificioManager from "./components/edificio/EdificioManager";
import { FiRefreshCw } from "react-icons/fi"; // Importar el icono de refrescar

const GestionSedes: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado, idSede, verifyJwt } = useRol();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [coordinadores, setCoordinadores] = useState<User[]>([]);
  const [selectedSedes, setSelectedSedes] = useState<number[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [nextFetchTime, setNextFetchTime] = useState<number>(300); // 5 minutes in seconds
  const [manualCooldown, setManualCooldown] = useState<number>(0); // Cooldown de 1 minuto para el botón manual
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const isValid = await verifyJwt();
    if (!isValid) return;

    setIsLoading(true);
    setError(null); // Reset error state before fetching data

    try {
      const sedesData = await fetchSedes();
      sedesData.sort((a: Sede, b: Sede) => a.id_sede - b.id_sede);
      setSedes(sedesData);
      if (rolSimulado === "admin") {
        setSelectedSedes(sedesData.map((sede: Sede) => sede.id_sede)); // Select all sedes by default
      } else {
        const userSede = sedesData.find(
          (sede: Sede) => sede.id_sede === idSede
        );
        if (userSede) {
          setSelectedSedes([userSede.id_sede]);
        }
      }

      const municipiosData = await fetchMunicipios();
      municipiosData.sort((a: Municipio, b: Municipio) => a.nombre.localeCompare(b.nombre));
      setMunicipios(municipiosData);

      const coordinadoresData = await fetchUsers();
      coordinadoresData.sort((a: User, b: User) => a.id_persona - b.id_persona);
      setCoordinadores(coordinadoresData);

      const edificiosData = await fetchEdificios();
      edificiosData.sort((a: Edificio, b: Edificio) => a.id_sede - b.id_sede);
      setEdificios(edificiosData);

      setLastFetchTime(new Date());
      setNextFetchTime(300); // Reset the timer
    } catch (error: any) {
      setError(`❌ Error al cargar los datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      setNextFetchTime((prev) => {
        if (prev <= 1) {
          fetchData();
          return 300; // Reset the timer
        }
        return prev - 1;
      });

      setManualCooldown((prev) => (prev > 0 ? prev - 1 : 0)); // Reducir el cooldown manual
    }, 1000);

    return () => clearInterval(interval);
  }, [rolSimulado, idSede]);

  const handleManualFetch = () => {
    if (manualCooldown === 0) {
      fetchData();
      setManualCooldown(60); // Cooldown de 1 minuto
    }
  };

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
      <div className="mt-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#034f00]">
              {rolSimulado === "admin" && "Gestión de Infraestructura"}
              {rolSimulado === "coord" && "Gestión de Sede"}
              {rolSimulado === "maint" && "Informes Sede"}
              {rolSimulado === "user" && "Buscador de edificios"}
            </h1>
            <p className="text-gray-600">
              Última actualización: {lastFetchTime ? lastFetchTime.toLocaleTimeString() : "N/A"}
            </p>
            <p className="text-gray-600">
              Próxima actualización en: {Math.floor(nextFetchTime / 60)}:{(nextFetchTime % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <button
            onClick={handleManualFetch}
            disabled={manualCooldown > 0}
            className={`bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ${manualCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        <SedeManager
          sedes={sedes}
          municipios={municipios}
          coordinadores={coordinadores}
          selectedSedes={selectedSedes}
          setSelectedSedes={setSelectedSedes}
          rolSimulado={rolSimulado}
          idSede={idSede}
          setSedes={setSedes} // Pasamos setSedes al SedeManager
        />
        <EdificioManager
          edificios={edificios}
          sedes={sedes}
          municipios={municipios}
          coordinadores={coordinadores}
          selectedSedes={selectedSedes}
          setSelectedSedes={setSelectedSedes}
          rolSimulado={rolSimulado}
          idSede={idSede}
          setEdificios={setEdificios} // Pasamos setEdificios al EdificioManager
        />
      </div>
    </div>
  );
};

export default GestionSedes;