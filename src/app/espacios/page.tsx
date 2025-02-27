"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Edificio, Espacio, Sede, User } from "../../types/api";
import { fetchEdificioById } from "../api/EdificioActions";
import { fetchEspaciosByEdificios } from "../api/EspacioActions";
import { fetchSedeById } from "../api/SedeActions";
import { getAdmins } from "../api/UserActions";
import EspacioManager from "./components/espacio/EspacioManager";
import MantenimientoManager from "./components/mantenimiento/MantenimientoManager";
import EventoManager from "./components/evento/EventoManager";
import { Footer, Header } from "../../../components";
import { useRol } from "../../../context/RolContext";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi"; // Importar el icono de refrescar

const GestionEspacios: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const idEdificio = searchParams.get("idEdificio");
  const { rolSimulado, idSede, verifyJwt } = useRol();

  const [edificio, setEdificio] = useState<Edificio | null>(null);
  const [sede, setSede] = useState<Sede | null>(null);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null); // Estado del espacio seleccionado
  const [selectedTab, setSelectedTab] = useState("espacios");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [nextFetchTime, setNextFetchTime] = useState<number>(300); // 5 minutes in seconds
  const [manualCooldown, setManualCooldown] = useState<number>(0); // Cooldown de 1 minuto para el botón manual
  const [coordinadores, setCoordinadores] = useState<User[]>([]);

  const fetchData = async () => {
    const isValid = await verifyJwt();
    if (!isValid) return;

    try {
      if (idEdificio) {
        const edificioData = await fetchEdificioById(idEdificio as string);
        if (
          edificioData &&
          rolSimulado !== "admin" &&
          edificioData.id_sede !== idSede
        ) {
          setError(
            "No tiene permiso para acceder a este edificio. Seleccione un edificio válido desde la página de Infraestructura."
          );
          return;
        }
        setEdificio(edificioData);
        const espaciosData = await fetchEspaciosByEdificios([
          parseInt(idEdificio as string),
        ]);
        setEspacios(espaciosData);
        if (edificioData && edificioData.id_sede) {
          const sedeData = await fetchSedeById(edificioData.id_sede);
          setSede(sedeData);
        }
        const coordinadoresData = await getAdmins();
        setCoordinadores(coordinadoresData);
        setLastFetchTime(new Date());
        setNextFetchTime(300); // Reset the timer
      }
    } catch (error: any) {
      setError(`❌ Error al cargar los datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!idEdificio) {
      setError(
        "No se ha proporcionado un ID de edificio. (Idealmente) Debe seleccionarse desde la página de Infraestructura"
      );
      return;
    }

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
  }, [idEdificio, rolSimulado, idSede]);

  const handleManualFetch = () => {
    if (manualCooldown === 0) {
      fetchData();
      setManualCooldown(60); // Cooldown de 1 minuto
    }
  };

  const handleEspacioSelect = (espacio: Espacio | null) => {
    setSelectedEspacio(espacio);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold text-[#034f00]">
            Gestión de Espacios
          </h1>
          <p className="text-gray-700 mt-4">{error}</p>
          <div className="mt-6">
            <Link
              href="/infraestructura"
              className="bg-red-600 text-white px-6 py-3 text-lg rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Volver a Infraestructura
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const correos = coordinadores.reduce((acc, coord) => {
    acc[coord.id_persona] = coord.correo;
    return acc;
  }, {} as { [key: number]: string });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="mt-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#034f00]">
              Gestión de Espacios
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
        <div className="flex justify-center">
          <table className="table-auto border-collapse">
            <tbody>
              <tr>
                <td className="p-4 align-top text-center">
                  {edificio && (
                    <div>
                      <h2 className="text-xl font-bold text-black">
                        Edificio: {edificio.nombre}
                      </h2>
                      <p className="text-gray-700">
                        Dirección: {edificio.dirección}
                      </p>
                      {sede && (
                        <p className="text-gray-700">Sede: {sede.nombre}</p>
                      )}
                      <p className="text-gray-700">
                        Categoría: {edificio.categoría}
                      </p>
                    </div>
                  )}
                </td>
                <td className="p-4 align-top text-center">
                  {selectedEspacio ? (
                    <div>
                      <h2 className="text-xl font-bold text-black">
                        Espacio: {selectedEspacio.nombre}
                      </h2>
                      <p className="text-gray-700">
                        Estado: {selectedEspacio.estado}
                      </p>
                      <p className="text-gray-700">
                        Clasificación: {selectedEspacio.clasificacion}
                      </p>
                      <p className="text-gray-700">
                        Uso: {selectedEspacio.uso}
                      </p>
                      <p className="text-gray-700">
                        Tipo: {selectedEspacio.tipo}
                      </p>
                      <p className="text-gray-700">
                        Piso: {selectedEspacio.piso}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-700">Selecciona un espacio</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-4 align-top text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedTab("espacios")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedTab === "espacios"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      Espacios
                    </button>
                  </div>
                </td>
                <td className="p-4 align-top text-center">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setSelectedTab("eventos")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedTab === "eventos"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      } ${
                        !selectedEspacio ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={!selectedEspacio}
                    >
                      Eventos
                    </button>
                    <button
                      onClick={() => setSelectedTab("mantenimiento")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedTab === "mantenimiento"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      } ${
                        !selectedEspacio ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={!selectedEspacio}
                    >
                      Mantenimiento
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="">
          {selectedTab === "espacios" && (
            <EspacioManager
              espacios={espacios}
              onEspaciosUpdated={setEspacios}
              idEdificio={parseInt(idEdificio as string)}
              rol={rolSimulado}
              onEspacioSelect={handleEspacioSelect}
            />
          )}
          {selectedTab === "eventos" && selectedEspacio &&(
              <EventoManager
                espacio={selectedEspacio}
                rol={rolSimulado}
              />
          )}
          {selectedTab === "mantenimiento" && selectedEspacio && (
            <MantenimientoManager
              espacio={selectedEspacio}
              rol={rolSimulado}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestionEspacios;