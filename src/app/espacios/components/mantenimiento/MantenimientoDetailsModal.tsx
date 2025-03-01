"use client";

import { useState, useEffect, useRef } from "react";
import { Mantenimiento, User } from "../../../../types/api";
import { updateMantenimiento, deleteMantenimiento } from "../../../api/MantenimientoActions";
import { estadosMantenimiento, tiposMantenimiento, prioridadesMantenimiento, necesidadesMantenimiento, detallesMantenimiento } from "../../../api/desplegableValues";
import { validateTextNotNull, validatePositiveNumber } from "../../../api/validation";

interface MantenimientoDetailsModalProps {
  mantenimiento: Mantenimiento | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mantenimiento: Mantenimiento) => void;
  onDelete: (id_mantenimiento: number) => void;
  maints: User[]; // Arreglo de usuarios de mantenimiento
}

const MantenimientoDetailsModal: React.FC<MantenimientoDetailsModalProps> = ({ mantenimiento, isOpen, onClose, onSave, onDelete, maints }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [editedMantenimiento, setEditedMantenimiento] = useState<Mantenimiento | null>(mantenimiento);
  const [editMode, setEditMode] = useState(false);
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
        detalle: !validateTextNotNull(editedMantenimiento.detalle),
        plazo_ideal: !validatePositiveNumber(editedMantenimiento.plazo_ideal),
      };

      if (Object.values(validationErrors).some(error => error)) {
        setError("Por favor corrija los errores antes de guardar.");
        return;
      }

      try {
        const updatedMantenimiento = await updateMantenimiento(editedMantenimiento);
        if (updatedMantenimiento) {
          onSave(updatedMantenimiento);
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
    if (mantenimiento) {
      try {
        await deleteMantenimiento(mantenimiento.id_mantenimiento);
        onDelete(mantenimiento.id_mantenimiento);
        setConfirmDelete(false);
        onClose();
      } catch (error: any) {
        setError(`Error al eliminar el mantenimiento: ${error.message}`);
        setConfirmDelete(false);
      }
    }
  };

  const handleClose = () => {
    setEditedMantenimiento(mantenimiento);
    setEditMode(false);
    setError(null);
    onClose();
  };

  const handleDeleteEncargado = () => {
    handleEditField("id_encargado", null);
  };

  if (!isOpen || !editedMantenimiento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-4xl w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR MANTENIMIENTO</p>
            <p className="font-bold">{mantenimiento?.detalle}</p>
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
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Encargado</label>
                  <select
                    value={editedMantenimiento.id_encargado || ""}
                    onChange={(e) => handleEditField("id_encargado", e.target.value ? Number(e.target.value) : null)}
                    className="mt-1 p-2 border rounded w-full text-black"
                    disabled={!editMode}
                  >
                    <option value="">Seleccione un encargado</option>
                    {maints.map((maint) => (
                      <option key={maint.id_persona} value={maint.id_persona}>
                        {maint.nombre} ({maint.correo})
                      </option>
                    ))}
                  </select>
                </div>
                {editedMantenimiento.id_encargado && editMode && (
                  <button
                    onClick={handleDeleteEncargado}
                    className="ml-2 mt-6 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={editedMantenimiento.estado}
                  onChange={(e) => handleEditField("estado", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {estadosMantenimiento.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={editedMantenimiento.tipo}
                  onChange={(e) => handleEditField("tipo", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {tiposMantenimiento.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <select
                  value={editedMantenimiento.prioridad}
                  onChange={(e) => handleEditField("prioridad", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {prioridadesMantenimiento.map((prioridad) => (
                    <option key={prioridad} value={prioridad}>
                      {prioridad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Necesidad</label>
                <select
                  value={editedMantenimiento.necesidad}
                  onChange={(e) => handleEditField("necesidad", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {necesidadesMantenimiento.map((necesidad) => (
                    <option key={necesidad} value={necesidad}>
                      {necesidad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Detalle</label>
                <select
                  value={editedMantenimiento.detalle}
                  onChange={(e) => handleEditField("detalle", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {detallesMantenimiento.map((detalle) => (
                    <option key={detalle} value={detalle}>
                      {detalle}
                    </option>
                  ))}
                </select>
                {!validateTextNotNull(editedMantenimiento.detalle) && (
                  <p className="text-red-500 text-sm">Detalle no puede ser vacío.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Asignación</label>
                <input
                  type="date"
                  value={editedMantenimiento.fecha_asignacion.split('T')[0]}
                  onChange={(e) => handleEditField("fecha_asignacion", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plazo Ideal (días)</label>
                <input
                  type="number"
                  value={editedMantenimiento.plazo_ideal}
                  onChange={(e) => handleEditField("plazo_ideal", Number(e.target.value))}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
                {!validatePositiveNumber(editedMantenimiento.plazo_ideal) && (
                  <p className="text-red-500 text-sm">Plazo Ideal debe ser un número positivo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Observación</label>
                <textarea
                  value={editedMantenimiento.observación}
                  onChange={(e) => handleEditField("observación", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
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