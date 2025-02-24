"use client";

import { useState } from "react";
import MantenimientoTable from "./MantenimientoTable";
import MantenimientoDetailsModal from "./EspacioDetailsModal";
import AddMantenimientoModal from "./AddMantenimientoModal";
import { Mantenimiento, User } from "../../../../types/api";

interface MantenimientoManagerProps {
  mantenimientos: Mantenimiento[];
  mantenedores: User[];
  onMantenimientosUpdated: (mantenimientos: Mantenimiento[]) => void;
  idEspacio: number;
  rol: string;
  onMantenimientoSelect: (mantenimiento: Mantenimiento | null) => void;
}

const MantenimientoManager: React.FC<MantenimientoManagerProps> = ({
  mantenimientos,
  onMantenimientosUpdated,
  idEspacio,
  rol
}) => {
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | null>(null);
  const [selectedMantenimientoId, setSelectedMantenimientoId] = useState<number | null>(null);
  const [isMantenimientoModalOpen, setIsMantenimientoModalOpen] = useState(false);
  const [isAddMantenimientoModalOpen, setIsAddMantenimientoModalOpen] = useState(false);

  const handleMantenimientoClick = (mantenimiento: Mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setIsMantenimientoModalOpen(true);
  };

  const handleAddMantenimiento = (newMantenimientos: Mantenimiento[]) => {
    onMantenimientosUpdated([...mantenimientos, ...newMantenimientos]);
  };

  const handleMantenimientoSelect = (id: number) => {
    const selected = mantenimientos.find((mantenimiento) => mantenimiento.id_mantenimiento === id) || null;
    setSelectedMantenimientoId(id);
    setSelectedMantenimiento(selected);
    onMantenimientoSelect(selected);
  };

  const handleSaveMantenimiento = (updatedMantenimiento: Mantenimiento) => {
    const updatedMantenimientos = mantenimientos.map((mantenimiento) =>
      mantenimiento.id_mantenimiento === updatedMantenimiento.id_mantenimiento ? updatedMantenimiento : mantenimiento
    );
    onMantenimientosUpdated(updatedMantenimientos);
    setSelectedMantenimiento(updatedMantenimiento);
    onMantenimientoSelect(updatedMantenimiento);
  };

  const handleDeleteMantenimiento = (id_mantenimiento: number) => {
    const updatedMantenimientos = mantenimientos.filter((mantenimiento) => mantenimiento.id_mantenimiento !== id_mantenimiento);
    onMantenimientosUpdated(updatedMantenimientos);
    setSelectedMantenimiento(null);
    setSelectedMantenimientoId(null);
    onMantenimientoSelect(null);
  };

  const handleAddMantenimientoClick = () => {
    setIsAddMantenimientoModalOpen(true);
  };

  return (
    <div>
      <MantenimientoTable
        mantenimientos={mantenimientos}
        onMantenimientoClick={handleMantenimientoClick}
        onMantenimientoSelect={handleMantenimientoSelect}
        selectedMantenimientoId={selectedMantenimientoId}
        rol={rol}
        onAddMantenimientoClick={handleAddMantenimientoClick} // Pasar la función para abrir el modal
      />
      <MantenimientoDetailsModal
        mantenimiento={selectedMantenimiento}
        isOpen={isMantenimientoModalOpen}
        onClose={() => setIsMantenimientoModalOpen(false)}
        onSave={handleSaveMantenimiento}
        onDelete={handleDeleteMantenimiento}
      />
      <AddMantenimientoModal
        isOpen={isAddMantenimientoModalOpen}
        onClose={() => setIsAddMantenimientoModalOpen(false)}
        onMantenimientosAdded={handleAddMantenimiento}
        idEspacio={idEspacio}
      />
    </div>
  );
};

export default MantenimientoManager;