"use client";
import { useState, useEffect, useRef } from "react";
import { User, Sede, Municipio } from "../../../../types/api";
import { updateSede, deleteSede } from "../../../api/SedeActions";
import { validateTextNotNull } from "../../../api/validation";

interface SedeDetailsModalProps {
  sede: Sede | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSede: Sede) => void;
  onDelete: (id_sede: number) => void;
  municipios: Municipio[];
  coordinadores: User[];
}

const SedeDetailsModal: React.FC<SedeDetailsModalProps> = ({
  sede,
  isOpen,
  onClose,
  onSave,
  onDelete,
  municipios,
  coordinadores,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedSede, setEditedSede] = useState<Sede | null>(sede);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setEditedSede(sede);
  }, [sede]);

  const handleEditField = (field: keyof Sede, value: string | number | null) => {
    setEditedSede((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (editedSede) {
      const validationErrors = {
        nombre: !validateTextNotNull(editedSede.nombre),
        municipio: !editedSede.municipio,
      };

      if (Object.values(validationErrors).some((error) => error)) {
        setError("Por favor corrija los errores antes de guardar.");
        return;
      }

      try {
        const updatedSede = await updateSede(editedSede);
        if (updatedSede) {
          onSave(updatedSede);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          setEditMode(false);
        }
      } catch (error: any) {
        setError(`Error al guardar los cambios: ${error.message}`);
      }
    }
  };

  const handleDelete = async () => {
    if (sede) {
      try {
        await deleteSede(sede.id_sede);
        onDelete(sede.id_sede);
        setConfirmDelete(false);
        onClose();
      } catch (error: any) {
        setError(`Error al eliminar la sede: ${error.message}`);
        setConfirmDelete(false);
      }
    }
  };

  const handleClose = () => {
    setEditedSede(sede);
    setEditMode(false);
    setError(null);
    onClose();
  };

  const handleDeleteCoordinador = () => {
    handleEditField("coordinador", null);
  };

  if (!isOpen || !editedSede) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-md w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR SEDE</p>
            <p className="font-bold">{sede?.nombre}</p>
            <p>¿Está seguro? Esta acción no se puede deshacer.</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleDelete}
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
            <h2 className="text-xl font-bold mb-4 text-black">Detalles de la Sede</h2>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editedSede?.nombre || ""}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validateTextNotNull(editedSede?.nombre || "") ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validateTextNotNull(editedSede?.nombre || "") && (
                  <p className="text-red-500 text-sm">Nombre no puede ser vacío.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Municipio</label>
                <select
                  value={editedSede?.municipio || ""}
                  onChange={(e) => handleEditField("municipio", parseInt(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${!editedSede?.municipio ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                >
                  <option value="">Seleccione un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </select>
                {!editedSede?.municipio && (
                  <p className="text-red-500 text-sm">Municipio no puede ser vacío.</p>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Coordinador</label>
                  <select
                    value={editedSede?.coordinador || ""}
                    onChange={(e) => handleEditField("coordinador", e.target.value ? Number(e.target.value) : null)}
                    className="mt-1 p-2 border rounded w-full text-black"
                    disabled={!editMode}
                  >
                    <option value="">Seleccione un coordinador</option>
                    {coordinadores.map((coordinador) => (
                      <option key={coordinador.id_persona} value={coordinador.id_persona}>
                        {coordinador.nombre} ({coordinador.correo})
                      </option>
                    ))}
                  </select>
                </div>
                {editedSede?.coordinador && editMode && (
                  <button
                    onClick={handleDeleteCoordinador}
                    className="ml-2 mt-6 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
            </div>
            {showSuccess && (
              <div className="my-4 p-3 bg-green-100 text-green-700 rounded-lg">
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
                    onClick={handleClose}
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
                    onClick={() => setConfirmDelete(true)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={handleClose}
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