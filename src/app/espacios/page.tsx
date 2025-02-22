"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Edificio, Espacio, Sede } from "../../types/api";
import { fetchEdificioById } from "../api/auth/EdificioActions";
import { fetchEspaciosByEdificios } from "../api/auth/EspacioActions";
import { fetchSedeById } from "../api/auth/SedeActions";
import EspacioTable from "./components/espacio/EspacioTable";
import EspacioDetailsModal from "./components/espacio/EspacioDetailsModal";
import AddEspacioModal from "./components/espacio/AddEspacioModal";
import { Header } from "../../../components";
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
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null);
  const [selectedEspacioId, setSelectedEspacioId] = useState<number | null>(null);
  const [isEspacioModalOpen, setIsEspacioModalOpen] = useState(false);
  const [isAddEspacioModalOpen, setIsAddEspacioModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("espacios");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEdificio) {
      setError("No se ha proporcionado un ID de edificio. (Idealmente) Debe seleccionarse desde la página de Infraestructura");
      return;
    }

    if (rolSimulado === null || idSede === null) {
      return; // Esperar a que el rol y la sede estén disponibles
    }

    const fetchData = async () => {
      if (idEdificio) {
        const edificioData = await fetchEdificioById(idEdificio as string);
        if (edificioData && rolSimulado !== "admin" && edificioData.id_sede !== idSede) {
          setError("No tiene permiso para acceder a este edificio. Seleccione un edificio válido desde la página de Infraestructura.");
          return;
        }
        setEdificio(edificioData);
        const espaciosData = await fetchEspaciosByEdificios([parseInt(idEdificio as string)]);
        setEspacios(espaciosData);
        if (edificioData && edificioData.id_sede) {
          const sedeData = await fetchSedeById(edificioData.id_sede);
          setSede(sedeData);
        }
      }
    };
    fetchData();
  }, [idEdificio, rolSimulado, idSede]);

  const handleEspacioClick = (espacio: Espacio) => {
    setSelectedEspacio(espacio);
    setIsEspacioModalOpen(true);
  };

  const handleAddEspacio = (newEspacios: Espacio[]) => {
    setEspacios((prevEspacios) => [...prevEspacios, ...newEspacios]);
  };

  const handleEspacioSelect = (id: number) => {
    const selected = espacios.find((espacio) => espacio.id_espacio === id) || null;
    setSelectedEspacioId(id);
    setSelectedEspacio(selected);
  };

  const handleSaveEspacio = (updatedEspacio: Espacio) => {
    setEspacios((prevEspacios) =>
      prevEspacios.map((espacio) =>
        espacio.id_espacio === updatedEspacio.id_espacio ? updatedEspacio : espacio
      )
    );
    setSelectedEspacio(updatedEspacio);
  };

  const handleDeleteEspacio = (id_espacio: number) => {
    setEspacios((prevEspacios) => prevEspacios.filter((espacio) => espacio.id_espacio !== id_espacio));
    setSelectedEspacio(null);
    setSelectedEspacioId(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Espacios</h1>
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
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="mt-4 p-4">
        <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Espacios</h1>
        {edificio && (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-black">Edificio: {edificio.nombre}</h2>
            <p className="text-gray-700">Dirección: {edificio.dirección}</p>
            {sede && <p className="text-gray-700">Sede: {sede.nombre}</p>}
            <p className="text-gray-700">Categoría: {edificio.categoría}</p>
          </div>
        )}
        <div className="mt-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTab("espacios")}
              className={`px-4 py-2 rounded-lg ${selectedTab === "espacios" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
              Espacios
            </button>
            {selectedEspacio && (
              <button
                onClick={() => setSelectedTab("eventos_mantenimientos")}
                className={`px-4 py-2 rounded-lg ${selectedTab === "eventos_mantenimientos" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Eventos y Mantenimientos
              </button>
            )}
          </div>
          {(rolSimulado === "admin" || rolSimulado === "coord") && (
                  <button
                    onClick={() => setIsAddEspacioModalOpen(true)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300 mt-4"
                  >
                    + Añadir Espacios
                  </button>
                )}
          <div className="mt-4">
            {selectedTab === "espacios" && (
              <>
                <EspacioTable
                  espacios={espacios}
                  onEspacioClick={handleEspacioClick}
                  onEspacioSelect={handleEspacioSelect}
                  selectedEspacioId={selectedEspacioId}
                  rol={rolSimulado} // Pasar el rol al componente
                />
              </>
            )}
            {selectedTab === "eventos_mantenimientos" && selectedEspacio && (
              <div>
                <h2 className="text-xl font-bold text-black">Espacio: {selectedEspacio.nombre}</h2>
                <p className="text-gray-700">Descripción:</p>
                {/* Aquí irán los componentes de eventos y mantenimientos */}
              </div>
            )}
          </div>
        </div>
        <EspacioDetailsModal
          espacio={selectedEspacio}
          isOpen={isEspacioModalOpen}
          onClose={() => setIsEspacioModalOpen(false)}
          onSave={handleSaveEspacio}
          onDelete={handleDeleteEspacio}
        />
        <AddEspacioModal
          isOpen={isAddEspacioModalOpen}
          onClose={() => setIsAddEspacioModalOpen(false)}
          onEspaciosAdded={handleAddEspacio}
          idEdificio={parseInt(idEdificio as string)} // Pasar idEdificio al componente
        />
      </div>
    </div>
  );
};

export default GestionEspacios;