"use client";

import { useState, useEffect } from "react";
import { Mantenimiento } from "../../../../types/api";
import { updateMantenimiento, deleteMantenimiento } from "../../../api/MantenimientoActions";
import { estadosMantenimiento, tipoContratoMantenimiento, tiposMantenimiento, necesidadMantenimiento, prioridadMantenimiento, detalleMantenimiento } from "../../../api/desplegableValues";
import { validateTextNotNull, validatePositiveNumber } from "../../../api/validation";

interface MantenimientoDetailsModalProps {
  mantenimiento: Mantenimiento | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mantenimiento: Mantenimiento) => void;
  onDelete: (id_mantenimiento: number) => void;
}

const MantenimientoDetailsModal: React.FC<MantenimientoDetailsModalProps> = ({ mantenimiento, isOpen, onClose, onSave, onDelete }) => {
  const [editedMantenimiento, setEditedMantenimiento] = useState<Mantenimiento | null>(mantenimiento);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setEditedMantenimiento(mantenimiento);
  }, [mantenimiento]);

  const handleEditField = (field: string, value: any) => {
    if (editedMantenimiento) {
      setEditedMantenimiento({ ...editedMantenimiento, [field]: value });
    }
  };

  const handleSave = async () => {
    if (editedMantenimiento) {
      const validationErrors = {
        nombre: !validateTextNotNull(editedMantenimiento.nombre),
        capacidad: !validatePositiveNumber(editedMantenimiento.capacidad),
        mediciónmt2: !validatePositiveNumber(editedMantenimiento.mediciónmt2),
      };

      if (Object.values(validationErrors).some(error => error)) {
        setError("Por favor corrija los errores antes de guardar.");
        return;
      }

      const updatedMantenimiento = await updateMantenimiento(editedMantenimiento);
      if (updatedMantenimiento) {
        onSave(updatedMantenimiento);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setEditMode(false);
      }
    }
  };

  const handleDelete = async () => {
    if (mantenimiento) {
      await deleteMantenimiento(mantenimiento.id_mantenimiento);
      onDelete(mantenimiento.id_mantenimiento);
      setConfirmDelete(false);
      onClose();
    }
  };

  const handleClose = () => {
    setEditedMantenimiento(mantenimiento);
    setEditMode(false);
    setError(null);
    onClose();
  };

  if (!isOpen || !editedMantenimiento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR MANTENIMIENTO</p>
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
            <h2 className="text-xl font-bold mb-4 text-black">Detalles del Mantenimiento</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Encargado:</label>
                <input
                  type="text"
                  value={editedEspacio.nombre}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validateTextNotNull(editedEspacio.nombre) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validateTextNotNull(editedEspacio.nombre) && (
                  <p className="text-red-500 text-sm">Nombre no puede ser vacío.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={editedEspacio.estado}
                  onChange={(e) => handleEditField("estado", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {estadosEspacio.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
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

export default MantenimientoDetailsModal;