"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sede, Edificio, Municipio, User } from "../../types/api";
import { useRol } from "../../../context/RolContext";
import { fetchSedes, deleteSede } from "../api/auth/SedeActions";
import { fetchEdificios, deleteEdificio, updateEdificio } from "../api/auth/EdificioActions";
import SedeTable from "./components/sede/SedeTable";
import EdificioTable from "./components/edificio/EdificioTable";
import SedeDetailsModal from "./components/sede/SedeDetailsModal";
import EdificioDetailsModal from "./components/edificio/EdificioDetailsModal";
import AddSedeModal from "./components/sede/AddSedeModal";
import AddEdificioModal from "./components/edificio/AddEdificioModal";
import { fetchMunicipios } from "../api/auth/MunicipioActions";
import { getAdmins } from "../api/auth/UserActions";

const GestionSedes: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [coordinadores, setCoordinadores] = useState<User[]>([]);
  const [selectedSedes, setSelectedSedes] = useState<number[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [filters, setFilters] = useState({
    nombre: "",
    municipio: "",
  });
  const [edificioFilters, setEdificioFilters] = useState({
    nombre: "",
    categoria: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(null);
  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [isEdificioModalOpen, setIsEdificioModalOpen] = useState(false);
  const [isAddSedeModalOpen, setIsAddSedeModalOpen] = useState(false); // Estado para el modal de añadir sede
  const [isAddEdificioModalOpen, setIsAddEdificioModalOpen] = useState(false); // Estado para el modal de añadir edificio
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
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEdificiosData = async () => {
      setIsLoading(true);
      const edificiosData = await fetchEdificios();
      setEdificios(edificiosData);
      setIsLoading(false);
    };
    fetchEdificiosData();
  }, []);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleEdificioFilterChange = (filter: string, value: string) => {
    setEdificioFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleResetEdificioFilters = () => {
    setEdificioFilters({ nombre: "", categoria: "" });
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

  const handleEdificioClick = (edificio: Edificio) => {
    setSelectedEdificio(edificio);
    setIsEdificioModalOpen(true);
  };

  const getMunicipioNombre = (id: number) => {
    const municipio = municipios.find((m: Municipio) => m.id === id);
    return municipio ? municipio.nombre : "Sin municipio";
  };

  const uniqueMunicipios = Array.from(new Set(sedes.map((sede) => getMunicipioNombre(sede.municipio))));
  const uniqueCategorias = Array.from(new Set(edificios.map((edificio) => edificio.categoría)));

  const filteredSedes = sedes.filter((sede) => {
    const nombreMatch = sede.nombre.toLowerCase().includes(filters.nombre.toLowerCase());
    const municipioMatch = filters.municipio ? getMunicipioNombre(sede.municipio) === filters.municipio : true;
    return nombreMatch && municipioMatch;
  });

  const filteredEdificios = edificios.filter(
    (edificio) =>
      selectedSedes.includes(edificio.id_sede) &&
      (edificioFilters.nombre === "" || edificio.nombre.toLowerCase().includes(edificioFilters.nombre.toLowerCase())) &&
      (edificioFilters.categoria === "" || edificio.categoría === edificioFilters.categoria)
  );

  const handleSaveSede = (updatedSede: Sede) => {
    setSedes((prevSedes) =>
      prevSedes.map((sede) => (sede.id_sede === updatedSede.id_sede ? updatedSede : sede))
    );
    setSelectedSede(updatedSede); // Update the selected Sede
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveEdificio = (updatedEdificio: Edificio) => {
    setEdificios((prevEdificios) =>
      prevEdificios.map((edificio) => (edificio.id_edificio === updatedEdificio.id_edificio ? updatedEdificio : edificio))
    );
    setSelectedEdificio(updatedEdificio); // Update the selected Edificio
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddSedes = (newSedes: Sede[]) => {
    setSedes((prevSedes) => [...prevSedes, ...newSedes]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddEdificios = (newEdificios: Edificio[]) => {
    setEdificios((prevEdificios) => [...prevEdificios, ...newEdificios]);
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

  const handleDeleteEdificio = async (id_edificio: number) => {
    try {
      await deleteEdificio(id_edificio);
      setEdificios((prevEdificios) => prevEdificios.filter((edificio) => edificio.id_edificio !== id_edificio));
      setSelectedEdificio(null);
      setIsEdificioModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error : any) {
      console.error("Error al eliminar edificio:", error);
      alert(error.message || "Error al eliminar edificio");
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
      <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Infraestructura</h1>
      {/* Filtros */}
      {rolSimulado === "admin" && (
        <>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-black">Sedes</h2>
              <input
                type="text"
                placeholder="Filtrar por nombre"
                value={filters.nombre}
                onChange={(e) => handleFilterChange("nombre", e.target.value)}
                className="p-2 border rounded text-black"
              />
              <select
                value={filters.municipio}
                onChange={(e) => handleFilterChange("municipio", e.target.value)}
                className="p-2 border rounded text-black"
              >
                <option value="">Todos los municipios</option>
                {uniqueMunicipios.map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setFilters({ nombre: "", municipio: "" });
                  setCurrentPage(1); // Reset pagination to the first page
                }}
                className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300"
              >
                Reiniciar Filtros
              </button>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setIsAddSedeModalOpen(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
            >
              + Añadir Sedes
            </button>
            <button
              onClick={() => setIsAddEdificioModalOpen(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
            >
              + Añadir Edificios
            </button>
          </div>
        </>
      )}
      {/* Tabla de Sedes */}
      <div className="mt-2">
        <SedeTable
          sedes={filteredSedes}
          municipios={municipios}
          coordinadores={coordinadores}
          selectedSedes={selectedSedes}
          onSedeSelect={handleSedeSelect}
          onSedeDeselect={handleSedeDeselect}
          onSedeClick={handleSedeClick}
        />
      </div>
      {/* Filtros de Edificios */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-black">Edificios de las Sedes seleccionadas</h2>
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={edificioFilters.nombre}
            onChange={(e) => handleEdificioFilterChange("nombre", e.target.value)}
            className="p-2 border rounded text-black"
          />
          <select
            value={edificioFilters.categoria}
            onChange={(e) => handleEdificioFilterChange("categoria", e.target.value)}
            className="p-2 border rounded text-black"
          >
            <option value="">Todas las categorías</option>
            {uniqueCategorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetEdificioFilters}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300"
          >
            Reiniciar Filtros
          </button>
        </div>
      </div>
      {/* Tabla de Edificios */}
      <div className="mt-2">
        <EdificioTable
          edificios={filteredEdificios}
          filters={edificioFilters}
          onEdificioClick={handleEdificioClick}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Modals */}
      <SedeDetailsModal
        sede={selectedSede}
        isOpen={isSedeModalOpen}
        onClose={() => setIsSedeModalOpen(false)}
        onSave={handleSaveSede}
        onDelete={handleDeleteSede}
        editMode={editMode}
        setEditMode={setEditMode}
        editedSede={selectedSede}
        handleEditField={(field, value) => {
          setSelectedSede((prev) => (prev ? { ...prev, [field]: value } : null));
        }}
        showSuccess={showSuccess}
      />
      <EdificioDetailsModal
        edificio={selectedEdificio}
        isOpen={isEdificioModalOpen}
        onClose={() => setIsEdificioModalOpen(false)}
        onSave={handleSaveEdificio}
        onDelete={handleDeleteEdificio}
        editMode={editMode}
        setEditMode={setEditMode}
        editedEdificio={selectedEdificio}
        handleEditField={(field, value) => {
          setSelectedEdificio((prev) => (prev ? { ...prev, [field]: value } : null));
        }}
        showSuccess={showSuccess}
        sedes={sedes}
      />
      <AddSedeModal
        isOpen={isAddSedeModalOpen}
        onClose={() => setIsAddSedeModalOpen(false)}
        municipios={municipios}
        coordinadores={coordinadores}
        onSedeAdded={handleAddSedes}
        showSuccessMessage={() => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }}
      />
      <AddEdificioModal
        isOpen={isAddEdificioModalOpen}
        onClose={() => setIsAddEdificioModalOpen(false)}
        sedes={sedes}
        onEdificiosAdded={handleAddEdificios}
        showSuccessMessage={() => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }}
      />
    </div>
  );
};

export default GestionSedes;