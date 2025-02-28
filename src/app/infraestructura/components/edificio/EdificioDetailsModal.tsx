"use client";
import { useState, useEffect, useRef } from "react";
import { Edificio, Sede, User } from "../../../../types/api";
import { updateEdificio, deleteEdificio } from "../../../api/EdificioActions";
import { validateTextNotNull, validatePositiveNumber, validateCorreo } from "../../../api/validation";
import { fetchUsers } from "../../../api/UserActions";
import { categoriasEdificio, propiedadesEdificio, certUsoSuelo } from "../../../api/desplegableValues";

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
  const modalRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedEdificio, setEditedEdificio] = useState<Edificio | null>(edificio);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

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
    setEditedEdificio(edificio);
  }, [edificio]);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const handleEditField = (field: keyof Edificio, value: string | number | null) => {
    setEditedEdificio((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (editedEdificio) {
      const validationErrors = {
        nombre: !validateTextNotNull(editedEdificio.nombre),
        dirección: !validateTextNotNull(editedEdificio.dirección),
        id_sede: !editedEdificio.id_sede || editedEdificio.id_sede === 0,
        area_terreno: !validatePositiveNumber(editedEdificio.area_terreno),
        area_construida: !validatePositiveNumber(editedEdificio.area_construida),
        correo_titular: editedEdificio.correo_titular ? !validateCorreo(editedEdificio.correo_titular) || !users.some(user => user.correo === editedEdificio.correo_titular) : false,
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

  const handleDeleteTitular = () => {
    handleEditField("correo_titular", "");
    handleEditField("id_titular", null);
  };

  if (!isOpen || !editedEdificio) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-4xl w-full">
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
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  value={editedEdificio.dirección || ""}
                  onChange={(e) => handleEditField("dirección", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validateTextNotNull(editedEdificio.dirección) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validateTextNotNull(editedEdificio.dirección) && (
                  <p className="text-red-500 text-sm">Dirección no puede ser vacío.</p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  value={editedEdificio.categoría || ""}
                  onChange={(e) => handleEditField("categoría", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {categoriasEdificio.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Propiedad</label>
                <select
                  value={editedEdificio.propiedad || ""}
                  onChange={(e) => handleEditField("propiedad", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {propiedadesEdificio.map((propiedad) => (
                    <option key={propiedad} value={propiedad}>
                      {propiedad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Área Terreno (m²)</label>
                <input
                  type="number"
                  value={editedEdificio.area_terreno || ""}
                  onChange={(e) => handleEditField("area_terreno", Number(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validatePositiveNumber(editedEdificio.area_terreno) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validatePositiveNumber(editedEdificio.area_terreno) && (
                  <p className="text-red-500 text-sm">Área Terreno debe ser un número positivo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Área Construida (m²)</label>
                <input
                  type="number"
                  value={editedEdificio.area_construida || ""}
                  onChange={(e) => handleEditField("area_construida", Number(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${!validatePositiveNumber(editedEdificio.area_construida) ? "outline outline-red-500" : ""}`}
                  disabled={!editMode}
                />
                {!validatePositiveNumber(editedEdificio.area_construida) && (
                  <p className="text-red-500 text-sm">Área Construida debe ser un número positivo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cert. Uso Suelo</label>
                <select
                  value={editedEdificio.cert_uso_suelo ? "DISPONIBLE" : "NO DISPONIBLE"}
                  onChange={(e) => handleEditField("cert_uso_suelo", (e.target.value === "DISPONIBLE").toString())}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {certUsoSuelo.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Correo Titular</label>
                  <select
                    value={editedEdificio.id_titular || ""}
                    onChange={(e) => handleEditField("id_titular", e.target.value ? Number(e.target.value) : null)}
                    className={`mt-1 p-2 border rounded w-full text-black`}
                    disabled={!editMode}
                  >
                    <option value="">Seleccione un coordinador</option>
                    {users.map((user) => (
                      <option key={user.id_persona} value={user.id_persona}>
                        {user.nombre} ({user.correo})
                      </option>
                    ))}
                  </select>
                </div>
                {editedEdificio.id_titular && editMode && (
                  <button
                    onClick={handleDeleteTitular}
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

export default EdificioDetailsModal;