"use client";

import { useState, useEffect } from "react";
import { fetchMantenimientosByEspacios} from "../../../api/MantenimientoActions";
import {fetchMaints}    from "../../../api/UserActions";
import MantenimientoTable from "./MantenimientoTable";
import { Mantenimiento, Espacio, User } from "../../../../types/api";
import MantenimientoDetailsModal from "./MantenimientoDetailsModal";
import AddMantenimientoModal from "./AddMantenimientoModal";

interface MantenimientoManagerProps {
  espacio: Espacio;
}

const MantenimientoManager: React.FC<MantenimientoManagerProps> = ({ espacio }) => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | null>(null);
  const [isMantenimientoModalOpen, setIsMantenimientoModalOpen] = useState(false);
  const [isAddMantenimientoModalOpen, setIsAddMantenimientoModalOpen] = useState(false);
  const [maints, setMaints] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mantenimientosData, maintsData] = await Promise.all([
          fetchMantenimientosByEspacios([espacio.id_espacio]),
          fetchMaints(),
        ]);
        setMantenimientos(mantenimientosData);
        setMaints(maintsData);
      } catch (error: any) {
        setError(`❌ Error al cargar los datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [espacio.id_espacio]);

  const handleMantenimientoClick = (mantenimiento: Mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setIsMantenimientoModalOpen(true);
  };

  const handleAddMantenimiento = (newMantenimientos: Mantenimiento[]) => {
    setMantenimientos([...mantenimientos, ...newMantenimientos]);
  };

  const handleSaveMantenimiento = (updatedMantenimiento: Mantenimiento) => {
    const updatedMantenimientos = mantenimientos.map((mantenimiento) =>
      mantenimiento.id_mantenimiento === updatedMantenimiento.id_mantenimiento ? updatedMantenimiento : mantenimiento
    );
    setMantenimientos(updatedMantenimientos);
    setSelectedMantenimiento(updatedMantenimiento);
  };

  const handleDeleteMantenimiento = (id_mantenimiento: number) => {
    const updatedMantenimientos = mantenimientos.filter((mantenimiento) => mantenimiento.id_mantenimiento !== id_mantenimiento);
    setMantenimientos(updatedMantenimientos);
    setSelectedMantenimiento(null);
  };

  const handleAddMantenimientoClick = () => {
    setIsAddMantenimientoModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-black">Cargando mantenimientos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MantenimientoTable
        mantenimientos={mantenimientos}
        maints={maints}
        onMantenimientoClick={handleMantenimientoClick}
        onAddMantenimientoClick={handleAddMantenimientoClick}
      />
      <MantenimientoDetailsModal
        mantenimiento={selectedMantenimiento}
        isOpen={isMantenimientoModalOpen}
        onClose={() => setIsMantenimientoModalOpen(false)}
        onSave={handleSaveMantenimiento}
        onDelete={handleDeleteMantenimiento}
        maints={maints} // Pasar el arreglo de usuarios de mantenimiento
      />
      <AddMantenimientoModal
        isOpen={isAddMantenimientoModalOpen}
        onClose={() => setIsAddMantenimientoModalOpen(false)}
        onMantenimientosAdded={handleAddMantenimiento}
        idEspacio={espacio.id_espacio}
        maints={maints}
      />
    </div>
  );
};

export default MantenimientoManager;