"use client";
import { useState, useEffect } from "react";
import { User, Sede, Municipio } from "../../../../types/api";
import { fetchMunicipios } from "../../../api/auth/MunicipioActions";
import { getAdmins } from "../../../api/auth/UserActions";
import { updateSede } from "../../../api/auth/SedeActions";

interface SedeDetailsModalProps {
  sede: Sede | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSede: Sede) => void;
  onDelete: (id_sede: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  editedSede: Sede | null;
  handleEditField: (field: keyof Sede, value: string | number | null) => void;
  showSuccess: boolean;
}

const SedeDetailsModal = ({
  sede,
  isOpen,
  onClose,
  onSave,
  onDelete,
  editMode,
  setEditMode,
  editedSede,
  handleEditField,
  showSuccess
}: SedeDetailsModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [coordinadores, setCoordinadores] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const municipiosData = await fetchMunicipios();
      setMunicipios(municipiosData);
      const coordinadoresData = await getAdmins();
      setCoordinadores(coordinadoresData);
    };
    fetchData();
  }, []);

  if (!isOpen || !sede || !editedSede) return null;

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(sede.id_sede);
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    const updatedSede = await updateSede(editedSede);
    if (updatedSede) {
      onSave(updatedSede);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR SEDE</p>
            <p className="font-bold">{sede.nombre}</p>
            <p>¿Está seguro? Esta acción no se puede deshacer.</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Confirmar Eliminación
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-black">
              Detalles de la Sede
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedSede.nombre || ""}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Municipio
                </label>
                <select
                  value={editedSede.municipio || ""}
                  onChange={(e) => handleEditField("municipio", parseInt(e.target.value))}
                  className="mt-1 p-2 border rounded w-full text-black max-h-32 overflow-y-auto"
                  disabled={!editMode}
                >
                  <option value="">Seleccione un municipio</option>
                  {municipios.map((municipio: Municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coordinador
                </label>
                <div className="flex">
                  <select
                    value={editedSede.coordinador || ""}
                    onChange={(e) => handleEditField("coordinador", parseInt(e.target.value))}
                    className="mt-1 p-2 border rounded w-full text-black max-h-32 overflow-y-auto"
                    disabled={!editMode}
                  >
                    <option value="">Seleccione un coordinador</option>
                    {coordinadores.map((coordinador: User) => (
                      <option key={coordinador.id_persona} value={coordinador.id_persona}>
                        {coordinador.correo}
                      </option>
                    ))}
                  </select>
                  {editMode && (
                    <button
                      onClick={() => handleEditField("coordinador", null)}
                      className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
            {showSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                ¡Datos actualizados correctamente!
              </div>
            )}
            <div className="mt-4 flex space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      onClose();
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SedeDetailsModal;