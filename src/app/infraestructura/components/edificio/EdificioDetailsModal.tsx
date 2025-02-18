"use client";
import { useState } from "react";
import { Edificio } from "../../../../types/api";

interface EdificioDetailsModalProps {
  edificio: Edificio | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id_edificio: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  editedEdificio: Edificio | null;
  handleEditField: (field: keyof Edificio, value: string) => void;
  showSuccess: boolean;
}

const EdificioDetailsModal = ({
  edificio,
  isOpen,
  onClose,
  onSave,
  onDelete,
  editMode,
  setEditMode,
  editedEdificio,
  handleEditField,
  showSuccess
}: EdificioDetailsModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !edificio || !editedEdificio) return null;

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(edificio.id_edificio);
    setConfirmDelete(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR EDIFICIO</p>
            <p className="font-bold">{edificio.nombre}</p>
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
              Detalles del Edificio
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedEdificio.nombre || ""}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  value={editedEdificio.dirección || ""}
                  onChange={(e) => handleEditField("dirección", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <input
                  type="text"
                  value={editedEdificio.categoría || ""}
                  onChange={(e) => handleEditField("categoría", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Propiedad
                </label>
                <input
                  type="text"
                  value={editedEdificio.propiedad || ""}
                  onChange={(e) => handleEditField("propiedad", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Área del Terreno
                </label>
                <input
                  type="number"
                  value={editedEdificio.area_terreno || ""}
                  onChange={(e) => handleEditField("area_terreno", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Área Construida
                </label>
                <input
                  type="number"
                  value={editedEdificio.area_construida || ""}
                  onChange={(e) => handleEditField("area_construida", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Certificado de Uso de Suelo
                </label>
                <input
                  type="text"
                  value={editedEdificio.cert_uso_suelo ? "Sí" : "No"}
                  onChange={(e) => handleEditField("cert_uso_suelo", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                />
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
                    onClick={async () => {
                      await onSave();
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
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

export default EdificioDetailsModal;
