"use client";

import { useState, useEffect, useRef } from "react";
import { Evento, Programa } from "../../../../types/api";
import { updateEvento, deleteEvento } from "../../../api/EventoActions";
import { tiposEvento } from "../../../api/desplegableValues";

interface EventoDetailsModalProps {
  evento: Evento | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (evento: Evento) => void;
  onDelete: (id_evento: number) => void;
  programas: Programa[];
  rol: string;
}

const EventoDetailsModal: React.FC<EventoDetailsModalProps> = ({
  evento,
  isOpen,
  onClose,
  onSave,
  onDelete,
  programas,
  rol,
}) => {
  const [editedEvento, setEditedEvento] = useState<Evento | null>(evento);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedEvento(evento);
  }, [evento]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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

  const handleEditField = (field: string, value: any) => {
    if (editedEvento) {
      setEditedEvento({ ...editedEvento, [field]: value });
    }
  };

  const handleSave = async () => {
    if (editedEvento) {
      try {
        const updatedEvento = await updateEvento(editedEvento);
        if (updatedEvento) {
          onSave(updatedEvento);
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
    if (evento) {
      try {
        await deleteEvento(evento.id_evento);
        onDelete(evento.id_evento);
        setConfirmDelete(false);
        onClose();
      } catch (error: any) {
        setError(`Error al eliminar el evento: ${error.message}`);
      }
    }
  };

  const handleClose = () => {
    setEditedEvento(evento);
    setEditMode(false);
    setError(null);
    onClose();
  };

  const handleDayChange = (day: string) => {
    if (editedEvento) {
      const newDias = editedEvento.días.includes(day)
        ? editedEvento.días.replace(day, "")
        : editedEvento.días + day;
      setEditedEvento({ ...editedEvento, días: newDias });
    }
  };

  const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];

  if (!isOpen || !editedEvento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg max-w-4xl w-full z-60"
      >
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR EVENTO</p>
            <p className="font-bold">{evento?.nombre}</p>
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
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Detalles del Evento
            </h2>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedEvento.nombre}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={editedEvento.tipo}
                  onChange={(e) => handleEditField("tipo", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                >
                  {tiposEvento.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Programa
                </label>
                <select
                  value={editedEvento.id_programa}
                  onChange={(e) =>
                    handleEditField("id_programa", Number(e.target.value))
                  }
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                >
                  {programas.map((programa) => (
                    <option
                      key={programa.id_programa}
                      value={programa.id_programa}
                    >
                      {programa.programa_nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={editedEvento.fecha_inicio.split("T")[0]}
                  onChange={(e) =>
                    handleEditField("fecha_inicio", e.target.value)
                  }
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={editedEvento.hora_inicio}
                  onChange={(e) =>
                    handleEditField("hora_inicio", e.target.value)
                  }
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={editedEvento.fecha_fin.split("T")[0]}
                  onChange={(e) => handleEditField("fecha_fin", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  value={editedEvento.hora_fin}
                  onChange={(e) => handleEditField("hora_fin", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={editedEvento.descripcion}
                  onChange={(e) =>
                    handleEditField("descripcion", e.target.value)
                  }
                  className="mt-1 p-2 border rounded w-full text-gray-900"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Días
                </label>
                <div className="flex space-x-2">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center text-black">
                      <input
                        type="checkbox"
                        checked={editedEvento.días.includes(day)}
                        onChange={() => handleDayChange(day)}
                        disabled={!editMode}
                        className="mr-1"
                      />
                      {day}
                    </label>
                  ))}
                </div>
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
                  {(rol === "admin" || rol === "coord") && (
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
                    </>
                  )}
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

export default EventoDetailsModal;
