"use client";
import { useState, useEffect } from "react";
import { Edificio, Sede } from "../../../../types/api";
import { updateEdificio, deleteEdificio } from "../../../api/EdificioActions";
import { validateTextNotNull } from "../../../api/validation";

interface EdificioDetailsModalProps {
  edificio: Edificio | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEdificio: Edificio) => void;
  onDelete: (id_edificio: number) => void;
  sedes: Sede[];
}

const EdificioDetailsModal: React.FC<EdificioDetailsModalProps> = ({
  edificio,
  isOpen,
  onClose,
  onSave,
  onDelete,
  sedes,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedEdificio, setEditedEdificio] = useState<Edificio | null>(edificio);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setEditedEdificio(edificio);
  }, [edificio]);

  const handleEditField = (field: keyof Edificio, value: string | number | null) => {
    setEditedEdificio((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (editedEdificio) {
      const validationErrors = {
        nombre: !validateTextNotNull(editedEdificio.nombre),
        id_sede: !editedEdificio.id_sede,
      };

      if (Object.values(validationErrors).some((error) => error)) {
        setError("Por favor corrija los errores antes de guardar.");
        return;
      }

      try {
        const updatedEdificio = await updateEdificio(editedEdificio);
        if (updatedEdificio) {
          onSave(updatedEdificio);
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
    if (edificio) {
      try {
        await deleteEdificio(edificio.id_edificio);
        onDelete(edificio.id_edificio);
        setConfirmDelete(false);
        onClose();
      } catch (error: any) {
        setError(`Error al eliminar el edificio: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    setEditedEdificio(edificio);
    setEditMode(false);
    setError(null);
    onClose();
  };

  if (!isOpen || !editedEdificio) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR EDIFICIO</p>
            <p className="font-bold">{edificio?.nombre}</p>
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
            <h2 className="text-xl font-bold mb-4 text-black">Detalles del Edificio</h2>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={editedEdificio.nombre || ""}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validateTextNotNull(editedEdificio.nombre) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validateTextNotNull(editedEdificio.nombre) && (
                  <p className="text-red-500 text-sm">Nombre no puede ser vacío.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sede</label>
                <select
                  value={editedEdificio.id_sede || ""}
                  onChange={(e) => handleEditField("id_sede", parseInt(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${!editedEdificio.id_sede ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                >
                  <option value="">Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.id_sede} value={sede.id_sede}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
                {!editedEdificio.id_sede && (
                  <p className="text-red-500 text-sm">Sede no puede ser vacío.</p>
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

export default EdificioDetailsModal;