"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Sede, Edificio, Municipio, User, Espacio } from "../../types/api";
import { useRol } from "../../../context/RolContext";
import { fetchSedes, deleteSede } from "../api/auth/SedeActions";
import { fetchEspacios, deleteEspacio, updateEspacio } from "../api/auth/EspacioActions";
import SedeTable from "./components/sede/SedeTable";
import EspacioTable from "./components/espacio/EspacioTable";
import SedeDetailsModal from "./components/sede/SedeDetailsModal";
import EspacioDetailsModal from "./components/espacio/EspacioDetailsModal";
import AddSedeModal from "./components/sede/AddSedeModal";  
import { fetchMunicipios } from "../api/auth/MunicipioActions";
import { getAdmins } from "../api/auth/UserActions";

const GestionSedes: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Obtiene el id de la URL
  const [edificio, setEdificio] = useState(null);

  const { data: session } = useSession();
  const { rolSimulado } = useRol();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [coordinadores, setCoordinadores] = useState<User[]>([]);
  const [selectedSedes, setSelectedSedes] = useState<number[]>([]);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [filters, setFilters] = useState({
    nombre: "",
    municipio: "",
  });
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
  const [isAddSedeModalOpen, setIsAddSedeModalOpen] = useState(false); // Estado para el modal de añadir sede
  const [isAddEspacioModalOpen, setIsAddEspacioModalOpen] = useState(false); // Estado para el modal de añadir edificio
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const sedesData = await fetchSedes();
      setSedes(sedesData);
      setSelectedSedes(sedesData.map((sede: Sede) => sede.id_sede)); // Select all sedes by default
      const municipiosData = await fetchMunicipios();
      setMunicipios(municipiosData);
      const coordinadoresData = await getAdmins();
      setCoordinadores(coordinadoresData);

      // Si hay un ID en la URL, buscar el edificio correspondiente
      if (id) {
        try {
          const res = await fetch(`/api/edificios/${id}`);
          const data = await res.json();
          setEdificio(data);
        } catch (error) {
          console.error("Error cargando edificio:", error);
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

  useEffect(() => {
    const fetchEspaciosData = async () => {
      setIsLoading(true);
      const espaciosData = await fetchEspacios();
      setEspacios(espaciosData);
      setIsLoading(false);
    };
    fetchEspaciosData();
  }, []);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleEspacioFilterChange = (filter: string, value: string) => {
    setEspacioFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleResetEspacioFilters = () => {
    setEspacioFilters({ nombre: "", estado: "", tipo: "", clasificacion: "" });
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleSedeSelect = (id: number) => {
    setSelectedSedes((prev) => [...prev, id]);
  };

  const handleSedeDeselect = (id: number) => {
    setSelectedSedes((prev) => prev.filter((sedeId) => sedeId !== id));
  };

  const handleSedeClick = (sede: Sede) => {
    setSelectedSede(sede);
    setIsSedeModalOpen(true);
  };

  const handleEspacioClick = (espacio: Espacio) => {
    setSelectedEspacio(espacio);
    setIsEspacioModalOpen(true);
  };

  const getMunicipioNombre = (id: number) => {
    const municipio = municipios.find((m: Municipio) => m.id === id);
    return municipio ? municipio.nombre : "Sin municipio";
  };

  const uniqueMunicipios = Array.from(new Set(sedes.map((sede) => getMunicipioNombre(sede.municipio))));
  const uniqueCategorias = Array.from(new Set(espacios.map((espacio) => espacio.estado)));

  const filteredSedes = sedes.filter((sede) => {
    const nombreMatch = sede.nombre.toLowerCase().includes(filters.nombre.toLowerCase());
    const municipioMatch = filters.municipio ? getMunicipioNombre(sede.municipio) === filters.municipio : true;
    return nombreMatch && municipioMatch;
  });

  const filteredEspacios = espacios.filter(
    (espacio) =>
      (espacioFilters.nombre === "" || espacio.nombre.toLowerCase().includes(espacioFilters.nombre.toLowerCase())) &&
      (espacioFilters.estado === "" || espacio.estado === espacioFilters.estado) &&
      (espacioFilters.tipo === "" || espacio.tipo === espacioFilters.tipo) &&
      (espacioFilters.clasificacion === "" || espacio.clasificacion === espacioFilters.clasificacion) 
  );

  const handleSaveSede = (updatedSede: Sede) => {
    setSedes((prevSedes) =>
      prevSedes.map((sede) => (sede.id_sede === updatedSede.id_sede ? updatedSede : sede))
    );
    setSelectedSede(updatedSede); // Update the selected Sede
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveEspacio = (updatedEspacio: Espacio) => {
    setEspacios((prevEspacios) =>
      prevEspacios.map((espacio) => (espacio.id_espacio === updatedEspacio.id_espacio ? updatedEspacio : espacio))
    );
    setSelectedEspacio(updatedEspacio); // Update the selected Edificio
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddSedes = (newSedes: Sede[]) => {
    setSedes((prevSedes) => [...prevSedes, ...newSedes]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddEspacios = (newEspacios: Espacio[]) => {
    setEspacios((prevEspacios) => [...prevEspacios, ...newEspacios]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteSede = async (id_sede: number) => {
    try {
      await deleteSede(id_sede);
      setSedes((prevSedes) => prevSedes.filter((sede) => sede.id_sede !== id_sede));
      setSelectedSede(null);
      setIsSedeModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error : any) {
      console.error("Error al eliminar sede:", error);
      alert(error.message || "Error al eliminar sede");
    }
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
          <h2 className="text-xl font-bold text-black">Edificios de las Sedes seleccionadas</h2>
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

export default GestionSedes;