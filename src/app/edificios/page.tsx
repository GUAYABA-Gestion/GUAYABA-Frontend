"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Sede, Espacio } from "../../types/api";
import { useRol } from "../../../context/RolContext";
import { fetchSedes, deleteSede } from "../api/auth/SedeActions";
import { fetchEspacios, deleteEspacio, updateEspacio, fetchEspaciosByEdificios } from "../api/auth/EspacioActions";
import EspacioTable from "./components/espacio/EspacioTable";
import EspacioDetailsModal from "./components/espacio/EspacioDetailsModal";

const GestionEspacios: React.FC = () => {
  const searchParams = useSearchParams(); // Obtiene el id de la URL
  const id = searchParams.get("id");
  console.log(id)
  const { data: session } = useSession();
  const { rolSimulado } = useRol();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [espacioFilters, setEspacioFilters] = useState({
    nombre: "",
    estado: "",
    tipo: "",
    clasificacion: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null);
  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [isEspacioModalOpen, setIsEspacioModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (id) {
        try {
          console.log("OLAAAAAAAAAAA")
          const espaciosData = await fetchEspaciosByEdificios([Number(id)]);
          setEspacios(espaciosData);
        } catch (error) {
          console.error("Error cargando espacios:", error);
        }
      }

      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEspacioFilterChange = (filter: string, value: string) => {
    setEspacioFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleResetEspacioFilters = () => {
    setEspacioFilters({ nombre: "", estado: "", tipo: "", clasificacion: "" });
    setCurrentPage(1); // Reset pagination to the first page
  };


  const handleEspacioClick = (espacio: Espacio) => {
    setSelectedEspacio(espacio);
    setIsEspacioModalOpen(true);
  };


  const uniqueCategorias = Array.from(new Set(espacios.map((espacio) => espacio.estado)));


  const filteredEspacios = espacios.filter(
    (espacio) =>
      (espacioFilters.nombre === "" || espacio.nombre.toLowerCase().includes(espacioFilters.nombre.toLowerCase())) &&
      (espacioFilters.estado === "" || espacio.estado === espacioFilters.estado) &&
      (espacioFilters.tipo === "" || espacio.tipo === espacioFilters.tipo) &&
      (espacioFilters.clasificacion === "" || espacio.clasificacion === espacioFilters.clasificacion) 
  );


  const handleSaveEspacio = (updatedEspacio: Espacio) => {
    setEspacios((prevEspacios) =>
      prevEspacios.map((espacio) => (espacio.id_espacio === updatedEspacio.id_espacio ? updatedEspacio : espacio))
    );
    setSelectedEspacio(updatedEspacio); // Update the selected Edificio
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };


  const handleDeleteEspacio = async (id_espacio: number) => {
    try {
      await deleteEspacio(id_espacio);
      setEspacios((prevEspacios) => prevEspacios.filter((espacio) => espacio.id_espacio !== id_espacio));
      setSelectedEspacio(null);
      setIsEspacioModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error : any) {
      console.error("Error al eliminar espacio:", error);
      alert(error.message || "Error al eliminar espacio");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="p-4 bg-gray-50 min-h-screen text-black flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#034f00]">Buscador de Espacios</h1>
      {/* Filtros de Edificios */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-black">Espacios del Edificio</h2>
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={espacioFilters.nombre}
            onChange={(e) => handleEspacioFilterChange("nombre", e.target.value)}
            className="p-2 border rounded text-black"
          />
          <select
            value={espacioFilters.estado}
            onChange={(e) => handleEspacioFilterChange("estado", e.target.value)}
            className="p-2 border rounded text-black"
          >
            <option value="">Todos los estados</option>
            {uniqueCategorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetEspacioFilters}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300"
          >
            Reiniciar Filtros
          </button>
        </div>
      </div>
      {/* Tabla de Edificios */}
      <div className="mt-2">
        <EspacioTable
          espacios={filteredEspacios}
          filters={espacioFilters}
          onEspacioClick={handleEspacioClick}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Modals */}
      <EspacioDetailsModal
        espacio={selectedEspacio}
        isOpen={isEspacioModalOpen}
        onClose={() => setIsEspacioModalOpen(false)}
        onSave={handleSaveEspacio}
        onDelete={handleDeleteEspacio}
        editMode={editMode}
        setEditMode={setEditMode}
        editedEspacio={selectedEspacio}
        handleEditField={(field, value) => {
          setSelectedEspacio((prev) => (prev ? { ...prev, [field]: value } : null));
        }}
        showSuccess={showSuccess}
        sedes={sedes}
      />
    </div>
  );
};

export default GestionEspacios;