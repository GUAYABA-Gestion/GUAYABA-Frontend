"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Edificio, Espacio, Sede } from "../../types/api";
import { fetchEdificioById } from "../api/EdificioActions";
import { fetchEspaciosByEdificios } from "../api/EspacioActions";
import { fetchSedeById } from "../api/SedeActions";
import EspacioManager from "./components/espacio/EspacioManager";
import { Footer, Header } from "../../../components";
import { useRol } from "../../../context/RolContext";
import Link from "next/link";

const GestionEspacios: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const idEdificio = searchParams.get("idEdificio");
  const { rolSimulado, idSede } = useRol();

  const [edificio, setEdificio] = useState<Edificio | null>(null);
  const [sede, setSede] = useState<Sede | null>(null);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null); // Estado del espacio seleccionado
  const [selectedTab, setSelectedTab] = useState("espacios");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEdificio) {
      setError(
        "No se ha proporcionado un ID de edificio. (Idealmente) Debe seleccionarse desde la página de Infraestructura"
      );
      return;
    }

    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, [idEdificio, rolSimulado, idSede]);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="mt-4 p-4">
        <h1 className="text-2xl font-bold text-[#034f00]">
          Gestión de Espacios
        </h1>
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
        <div className="mt-4">
          {selectedTab === "espacios" && (
            <EspacioManager
              espacios={espacios}
              onEspaciosUpdated={setEspacios}
              idEdificio={parseInt(idEdificio as string)}
              rol={rolSimulado}
              onEspacioSelect={setSelectedEspacio} // Pasar la función para manejar el espacio seleccionado
            />
          )}
          {selectedTab === "eventos" && (
            <div>{/* Aquí irán los componentes de eventos */}</div>
          )}
          {selectedTab === "mantenimiento" && (
            <div>{/* Aquí irán los componentes de mantenimiento */}</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestionEspacios;