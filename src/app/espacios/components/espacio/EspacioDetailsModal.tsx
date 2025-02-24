"use client";

import { useState, useEffect } from "react";
import { Espacio } from "../../../../types/api";
import { updateEspacio, deleteEspacio } from "../../../api/EspacioActions";
import { estadosEspacio, clasificacionesEspacio, usosEspacio, tiposEspacio, pisosEspacio } from "../../../api/desplegableValues";
import { validateTextNotNull, validatePositiveNumber } from "../../../api/validation";

interface EspacioDetailsModalProps {
  espacio: Espacio | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (espacio: Espacio) => void;
  onDelete: (id_espacio: number) => void;
}

const EspacioDetailsModal: React.FC<EspacioDetailsModalProps> = ({ espacio, isOpen, onClose, onSave, onDelete }) => {
  const [editedEspacio, setEditedEspacio] = useState<Espacio | null>(espacio);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setEditedEspacio(espacio);
  }, [espacio]);

  const handleEditField = (field: string, value: any) => {
    if (editedEspacio) {
      setEditedEspacio({ ...editedEspacio, [field]: value });
    }
  };

  const handleSave = async () => {
    if (editedEspacio) {
      const validationErrors = {
        nombre: !validateTextNotNull(editedEspacio.nombre),
        capacidad: !validatePositiveNumber(editedEspacio.capacidad),
        mediciónmt2: !validatePositiveNumber(editedEspacio.mediciónmt2),
      };

      if (Object.values(validationErrors).some(error => error)) {
        setError("Por favor corrija los errores antes de guardar.");
        return;
      }

      try {
        const updatedEspacio = await updateEspacio(editedEspacio);
        if (updatedEspacio) {
          onSave(updatedEspacio);
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
    if (espacio) {
      try {
        await deleteEspacio(espacio.id_espacio);
        onDelete(espacio.id_espacio);
        setConfirmDelete(false);
        onClose();
      } catch (error: any) {
        setError(`Error al eliminar el espacio: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    setEditedEspacio(espacio);
    setEditMode(false);
    setError(null);
    onClose();
  };

  if (!isOpen || !editedEspacio) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR ESPACIO</p>
            <p className="font-bold">{espacio?.nombre}</p>
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
            <h2 className="text-xl font-bold mb-4 text-black">Detalles del Espacio</h2>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Clasificación</label>
                <select
                  value={editedEspacio.clasificacion}
                  onChange={(e) => handleEditField("clasificacion", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {clasificacionesEspacio.map((clasificacion) => (
                    <option key={clasificacion} value={clasificacion}>
                      {clasificacion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Uso</label>
                <select
                  value={editedEspacio.uso}
                  onChange={(e) => handleEditField("uso", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {usosEspacio.map((uso) => (
                    <option key={uso} value={uso}>
                      {uso}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={editedEspacio.tipo}
                  onChange={(e) => handleEditField("tipo", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {tiposEspacio.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Piso</label>
                <select
                  value={editedEspacio.piso}
                  onChange={(e) => handleEditField("piso", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {pisosEspacio.map((piso) => (
                    <option key={piso} value={piso}>
                      {piso}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                <input
                  type="number"
                  value={editedEspacio.capacidad}
                  onChange={(e) => handleEditField("capacidad", Number(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validatePositiveNumber(editedEspacio.capacidad) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validatePositiveNumber(editedEspacio.capacidad) && (
                  <p className="text-red-500 text-sm">Capacidad debe ser un número positivo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medición (m²)</label>
                <input
                  type="number"
                  value={editedEspacio.mediciónmt2}
                  onChange={(e) => handleEditField("mediciónmt2", Number(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validatePositiveNumber(editedEspacio.mediciónmt2) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validatePositiveNumber(editedEspacio.mediciónmt2) && (
                  <p className="text-red-500 text-sm">Medición debe ser un número positivo.</p>
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

export default EspacioDetailsModal;