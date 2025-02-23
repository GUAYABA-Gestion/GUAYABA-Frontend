"use client";

import { useState } from "react";
import { Edificio, Sede, Municipio, User } from "../../../../types/api";
import { deleteEdificio } from "../../../api/EdificioActions";
import EdificioTable from "./EdificioTable";
import EdificioDetailsModal from "./EdificioDetailsModal";
import AddEdificioModal from "./AddEdificioModal";
import ExcelExportButton from "./ExcelExportButton";
import { categoriasEdificio } from "../../../api/desplegableValues";

interface EdificioManagerProps {
  edificios: Edificio[];
  sedes: Sede[];
  municipios: Municipio[];
  coordinadores: User[];
  selectedSedes: number[];
  setSelectedSedes: (selectedSedes: number[]) => void;
  rolSimulado: string;
  idSede: number | null;
  setEdificios: (edificios: Edificio[]) => void;
}

const EdificioManager: React.FC<EdificioManagerProps> = ({
  edificios,
  sedes,
  municipios,
  coordinadores,
  selectedSedes,
  setSelectedSedes,
  rolSimulado,
  idSede,
  setEdificios,
}) => {
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(null);
  const [isEdificioModalOpen, setIsEdificioModalOpen] = useState(false);
  const [isAddEdificioModalOpen, setIsAddEdificioModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    nombre: "",
    categoria: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEdificioClick = (edificio: Edificio) => {
    setSelectedEdificio(edificio);
    setIsEdificioModalOpen(true);
  };

  const handleAddEdificio = (newEdificios: Edificio[]) => {
    setEdificios([...edificios, ...newEdificios]);
  };

  const handleSaveEdificio = (updatedEdificio: Edificio) => {
    const updatedEdificios = edificios.map((edificio) =>
      edificio.id_edificio === updatedEdificio.id_edificio ? updatedEdificio : edificio
    );
    setEdificios(updatedEdificios);
    setSelectedEdificio(updatedEdificio);
  };

  const handleDeleteEdificio = async (id_edificio: number) => {
    await deleteEdificio(id_edificio);
    const updatedEdificios = edificios.filter((edificio) => edificio.id_edificio !== id_edificio);
    setEdificios(updatedEdificios);
    setSelectedEdificio(null);
  };

  const handleAddEdificioClick = () => {
    setIsAddEdificioModalOpen(true);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleResetFilters = () => {
    setFilters({ nombre: "", categoria: "" });
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditField = (field: string, value: any) => {
    if (selectedEdificio) {
      setSelectedEdificio({ ...selectedEdificio, [field]: value });
    }
  };

  const filteredEdificios = edificios.filter((edificio) =>
    selectedSedes.includes(edificio.id_sede)
  ).filter((edificio) => {
    return (
      (filters.nombre === "" ||
        edificio.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
      (filters.categoria === "" || edificio.categoría === filters.categoria)
    );
  });

  return (
    <div>
      <EdificioTable
        edificios={filteredEdificios}
        filters={filters}
        onEdificioClick={handleEdificioClick}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        rolSimulado={rolSimulado}
        sedes={sedes}
        onAddEdificioClick={handleAddEdificioClick}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        uniqueCategorias={categoriasEdificio}
        selectedSedes={selectedSedes} // Pasamos selectedSedes al EdificioTable
      />

      <EdificioDetailsModal
        edificio={selectedEdificio}
        isOpen={isEdificioModalOpen}
        onClose={() => setIsEdificioModalOpen(false)}
        onSave={handleSaveEdificio}
        onDelete={handleDeleteEdificio}
        sedes={sedes}
      />
      <AddEdificioModal
        isOpen={isAddEdificioModalOpen}
        onClose={() => setIsAddEdificioModalOpen(false)}
        onEdificiosAdded={handleAddEdificio}
        sedes={sedes}
        municipios={municipios}
        coordinadores={coordinadores}
        rolSimulado={rolSimulado}
        idSede={idSede}
      />
    </div>
  );
};

export default EdificioManager;