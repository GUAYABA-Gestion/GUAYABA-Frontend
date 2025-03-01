"use client";
import { useState, useEffect, useRef } from "react";
import { User, Sede } from "../../../types/api";
import { updateUser, deleteUserManual, getUserReferences } from "../../api/UserActions";
import { validateCorreo, validateTelefono, validateTextNotNull } from "../../api/validation";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  onDelete: (id_persona: number) => void;
  sedes: Sede[];
  showSuccess: boolean;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  onDelete,
  sedes,
  showSuccess,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [references, setReferences] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState({
    nombre: false,
    correo: false,
    telefono: false,
    id_sede: false,
  });
  const [error, setError] = useState<string | null>(null);

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
    setEditedUser(user);
  }, [user]);

  if (!isOpen || !user || !editedUser) return null;

  const handleEditField = (field: keyof User, value: string | number | null) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleDeleteClick = async () => {
    try {
      const data = await getUserReferences(user.id_persona);
      setReferences(data.references);
      setConfirmDelete(true);
    } catch (error) {
      setError("Error al obtener referencias del usuario.");
      setConfirmDelete(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserManual(user.id_persona);
      onDelete(user.id_persona);
      setConfirmDelete(false);
      onClose();
    } catch (error: any) {
      setError(`Error al eliminar el usuario: ${error.message}`);
      setConfirmDelete(false);
    }
  };

  const handleSave = async () => {
    const errors = {
      nombre: !validateTextNotNull(editedUser.nombre),
      correo: !validateCorreo(editedUser.correo),
      telefono: editedUser.telefono ? !validateTelefono(editedUser.telefono) : false,
      id_sede: !editedUser.id_sede,
    };

    setValidationErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      setError("Por favor corrija los errores antes de guardar.");
      return;
    }

    try {
      const updatedUser = await updateUser(editedUser);
      onSave(updatedUser);
      setError(null); // Clear error if save is successful
      setEditMode(false);
    } catch (error: any) {
      setError(`Error al guardar los cambios: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const handleClose = () => {
    setValidationErrors({
      nombre: false,
      correo: false,
      telefono: false,
      id_sede: false,
    });
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-md w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR USUARIO </p>
            <p className="font-bold">{user.correo}</p>
            <p>¿Está seguro? Esta acción no se puede deshacer.</p>
            {references.length > 0 && (
              <>
                <p>
                  Si se elimina este usuario se eliminaría su referencia en
                  la(s) tabla(s):
                </p>
                <ul className="list-disc list-inside">
                  {references.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </>
            )}
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
              Detalles del Usuario
            </h2>
            {!user.es_manual && (
              <p className="text-red-500 mb-4">
                Este usuario no fue añadido manualmente. Algunos campos no son
                editables.
              </p>
            )}
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedUser.nombre || ""}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.nombre ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode || !user.es_manual}
                />
                {validationErrors.nombre && (
                  <p className="text-red-500 text-sm">Ingrese un nombre.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo
                </label>
                <input
                  type="text"
                  value={editedUser.correo || ""}
                  onChange={(e) => handleEditField("correo", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.correo ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode || !user.es_manual}
                />
                {validationErrors.correo && (
                  <p className="text-red-500 text-sm">Ingrese un correo apropiado.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={editedUser.telefono || ""}
                  onChange={(e) => handleEditField("telefono", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.telefono ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                />
                {validationErrors.telefono && (
                  <p className="text-red-500 text-sm">Ingrese un número de 10 cifras.</p>
                )}
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
                  onChange={(e) => handleEditField("id_sede", e.target.value ? Number(e.target.value) : null)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.id_sede ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                >
                  <option value="">Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.id_sede} value={sede.id_sede}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
                {validationErrors.id_sede && (
                  <p className="text-red-500 text-sm">Debe seleccionar una sede.</p>
                )}
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
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={handleCancelEdit}
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
                      onClick={handleDeleteClick}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
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

export default UserDetailsModal;