"use client";
import { User, Sede } from "../../../types/api";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id_persona: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  editedUser: User | null;
  handleEditField: (field: keyof User, value: string) => void;
  sedes: Sede[];
  showSuccess: boolean;
}

const UserDetailsModal = ({
  user,
  isOpen,
  onClose,
  onSave,
  onDelete,
  editMode,
  setEditMode,
  editedUser,
  handleEditField,
  sedes,
  showSuccess 
}: UserDetailsModalProps) => {
  if (!isOpen || !user || !editedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-black">
          Detalles del Usuario
        </h2>
        {!user.es_manual && (
          <p className="text-red-500 mb-4">
            Este usuario no fue añadido manualmente. Algunos campos no son
            editables.
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={editedUser.nombre || ""}
              onChange={(e) => handleEditField("nombre", e.target.value)}
              className="mt-1 p-2 border rounded w-full text-black"
              disabled={!editMode || !user.es_manual}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              type="text"
              value={editedUser.correo || ""}
              onChange={(e) => handleEditField("correo", e.target.value)}
              className="mt-1 p-2 border rounded w-full text-black"
              disabled={!editMode || !user.es_manual}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              value={editedUser.telefono || ""}
              onChange={(e) => handleEditField("telefono", e.target.value)}
              className="mt-1 p-2 border rounded w-full text-black"
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              value={editedUser.rol || ""}
              onChange={(e) => handleEditField("rol", e.target.value)}
              className="mt-1 p-2 border rounded w-full text-black"
              disabled={!editMode}
            >
              <option value="admin">Administrador</option>
              <option value="coord">Coordinador</option>
              <option value="maint">Mantenimiento</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sede
            </label>
            <select
              value={editedUser.id_sede || ""}
              onChange={(e) => handleEditField("id_sede", e.target.value)}
              className="mt-1 p-2 border rounded w-full text-black"
              disabled={!editMode}
            >
              <option value="">Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id_sede} value={sede.id_sede}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Detalles
            </label>
            <textarea
              value={editedUser.detalles || ""}
              onChange={(e) => handleEditField("detalles", e.target.value)}
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
              {user.es_manual && (
                <button
                  onClick={() => onDelete(user.id_persona)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
