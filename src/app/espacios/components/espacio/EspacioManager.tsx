"use client";

import { useState } from "react";
import EspacioTable from "./EspacioTable";
import EspacioDetailsModal from "./EspacioDetailsModal";
import AddEspacioModal from "./AddEspacioModal";
import { Espacio } from "../../../../types/api";

interface EspacioManagerProps {
  espacios: Espacio[];
  onEspaciosUpdated: (espacios: Espacio[]) => void;
  idEdificio: number;
  rol: string;
  onEspacioSelect: (espacio: Espacio | null) => void;
}

const EspacioManager: React.FC<EspacioManagerProps> = ({
  espacios,
  onEspaciosUpdated,
  idEdificio,
  rol,
  onEspacioSelect,
}) => {
  const [selectedEspacio, setSelectedEspacio] = useState<Espacio | null>(null);
  const [selectedEspacioId, setSelectedEspacioId] = useState<number | null>(null);
  const [isEspacioModalOpen, setIsEspacioModalOpen] = useState(false);
  const [isAddEspacioModalOpen, setIsAddEspacioModalOpen] = useState(false);

  const handleEspacioClick = (espacio: Espacio) => {
    setSelectedEspacio(espacio);
    setIsEspacioModalOpen(true);
  };

  const handleAddEspacio = (newEspacios: Espacio[]) => {
    onEspaciosUpdated([...espacios, ...newEspacios]);
  };

  const handleEspacioSelect = (id: number) => {
    const selected = espacios.find((espacio) => espacio.id_espacio === id) || null;
    setSelectedEspacioId(id);
    setSelectedEspacio(selected);
    onEspacioSelect(selected);
  };

  const handleSaveEspacio = (updatedEspacio: Espacio) => {
    const updatedEspacios = espacios.map((espacio) =>
      espacio.id_espacio === updatedEspacio.id_espacio ? updatedEspacio : espacio
    );
    onEspaciosUpdated(updatedEspacios);
    setSelectedEspacio(updatedEspacio);
    onEspacioSelect(updatedEspacio);
  };

  const handleDeleteEspacio = (id_espacio: number) => {
    const updatedEspacios = espacios.filter((espacio) => espacio.id_espacio !== id_espacio);
    onEspaciosUpdated(updatedEspacios);
    setSelectedEspacio(null);
    setSelectedEspacioId(null);
    onEspacioSelect(null);
  };

  const handleAddEspacioClick = () => {
    setIsAddEspacioModalOpen(true);
  };

  return (
    <div>
      <EspacioTable
        espacios={espacios}
        onEspacioClick={handleEspacioClick}
        onEspacioSelect={handleEspacioSelect}
        selectedEspacioId={selectedEspacioId}
        rol={rol}
        onAddEspacioClick={handleAddEspacioClick} // Pasar la función para abrir el modal
      />
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
        idEdificio={idEdificio}
      />
    </div>
  );
};

export default EspacioManager;