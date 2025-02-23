"use client";

import { useState } from "react";
import { Sede, Municipio, User } from "../../../../types/api";
import { deleteSede } from "../../../api/SedeActions";
import SedeTable from "./SedeTable";
import SedeDetailsModal from "./SedeDetailsModal";
import AddSedeModal from "./AddSedeModal";

interface SedeManagerProps {
  sedes: Sede[];
  municipios: Municipio[];
  coordinadores: User[];
  selectedSedes: number[];
  setSelectedSedes: (selectedSedes: number[]) => void;
  rolSimulado: string;
  idSede: number | null;
  setSedes: (sedes: Sede[]) => void; // Añadimos setSedes para actualizar el estado de las sedes
}

const SedeManager: React.FC<SedeManagerProps> = ({
  sedes,
  municipios,
  coordinadores,
  selectedSedes,
  setSelectedSedes,
  rolSimulado,
  idSede,
  setSedes, // Añadimos setSedes para actualizar el estado de las sedes
}) => {
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [isAddSedeModalOpen, setIsAddSedeModalOpen] = useState(false);

  const handleSedeClick = (sede: Sede) => {
    setSelectedSede(sede);
    setIsSedeModalOpen(true);
  };

  const handleAddSede = (newSedes: Sede[]) => {
    setSedes([...sedes, ...newSedes]); // Actualizamos el estado de las sedes
    setSelectedSedes([...selectedSedes, ...newSedes.map((sede) => sede.id_sede)]);
  };

  const handleSedeSelect = (id: number) => {
    setSelectedSedes((prev: number[]) => [...prev, id]);
  };

  const handleSedeDeselect = (id: number) => {
    setSelectedSedes((prev: number[]) => prev.filter((sedeId: number) => sedeId !== id));
  };

  const handleSaveSede = (updatedSede: Sede) => {
    const updatedSedes = sedes.map((sede) =>
      sede.id_sede === updatedSede.id_sede ? updatedSede : sede
    );
    setSedes(updatedSedes); // Actualizamos el estado de las sedes
    setSelectedSedes(updatedSedes.map((sede) => sede.id_sede));
    setSelectedSede(updatedSede);
  };

  const handleDeleteSede = async (id_sede: number) => {
    await deleteSede(id_sede);
    const updatedSedes = sedes.filter((sede) => sede.id_sede !== id_sede);
    setSedes(updatedSedes); // Actualizamos el estado de las sedes
    setSelectedSedes(updatedSedes.map((sede) => sede.id_sede));
    setSelectedSede(null);
  };

  const handleAddSedeClick = () => {
    setIsAddSedeModalOpen(true);
  };

  return (
    <div>
      <SedeTable
        sedes={sedes}
        municipios={municipios}
        coordinadores={coordinadores}
        selectedSedes={selectedSedes}
        onSedeSelect={handleSedeSelect}
        onSedeDeselect={handleSedeDeselect}
        onSedeClick={handleSedeClick}
        rolSimulado={rolSimulado}
        idSede={idSede}
        onAddSedeClick={handleAddSedeClick}
      />
      <SedeDetailsModal
        sede={selectedSede}
        isOpen={isSedeModalOpen}
        onClose={() => setIsSedeModalOpen(false)}
        onSave={handleSaveSede}
        onDelete={handleDeleteSede}
        municipios={municipios}
        coordinadores={coordinadores}
      />
      <AddSedeModal
        isOpen={isAddSedeModalOpen}
        onClose={() => setIsAddSedeModalOpen(false)}
        onSedesAdded={handleAddSede}
        municipios={municipios}
        coordinadores={coordinadores}
      />
    </div>
  );
};

export default SedeManager;