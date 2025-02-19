import { useState, useEffect } from "react";
import { Edificio, Sede, User } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber, validateCorreo } from "../../../api/auth/validation";
import { updateEdificio } from "../../../api/auth/EdificioActions";
import { fetchUsers } from "../../../api/auth/UserActions";

interface EdificioDetailsModalProps {
  edificio: Edificio | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEdificio: Edificio) => void;
  onDelete: (id_edificio: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  editedEdificio: Edificio | null;
  handleEditField: (field: keyof Edificio, value: string | boolean | number) => void;
  showSuccess: boolean;
  sedes: Sede[];
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
  showSuccess,
  sedes
}: EdificioDetailsModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    nombre: false,
    dirección: false,
    sede: false,
    area_terreno: false,
    area_construida: false,
    correo_titular: false,
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  if (!isOpen || !edificio || !editedEdificio) return null;

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(edificio.id_edificio);
    setConfirmDelete(false);
  };

  const handleSave = async () => {
    const errors = {
      nombre: !validateTextNotNull(editedEdificio.nombre),
      dirección: !validateTextNotNull(editedEdificio.dirección),
      sede: !editedEdificio.id_sede,
      area_terreno: !validatePositiveNumber(editedEdificio.area_terreno),
      area_construida: !validatePositiveNumber(editedEdificio.area_construida),
      correo_titular: !validateCorreo(editedEdificio.correo_titular) || !users.some(user => user.correo === editedEdificio.correo_titular),
    };
  
    setValidationErrors(errors);
  
    if (Object.values(errors).some((error) => error)) {
      alert("Por favor corrija los errores antes de guardar.");
      return;
    }
  
    const titular = users.find(user => user.correo === editedEdificio.correo_titular);
    const updatedEdificio = await updateEdificio({
      ...editedEdificio,
      id_titular: titular ? titular.id_persona : editedEdificio.id_titular,
      correo_titular: editedEdificio.correo_titular?.trim() || "",
    });
    if (updatedEdificio) {
      onSave({
        ...updatedEdificio,
        correo_titular: editedEdificio.correo_titular?.trim() || "",
      });
    }
  };

  const handleClose = () => {
    setValidationErrors({
      nombre: false,
      dirección: false,
      sede: false,
      area_terreno: false,
      area_construida: false,
      correo_titular: false,
    });
    onClose();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    handleClose();
  };

  const categorias = ["CAT", "PRINCIPAL", "SEDE", "SEDE Y CAT", "OTRO"];
  const propiedades = ["PROPIO", "ARRENDADO", "NO OPERACIONAL"];
  const certUsoSueloOptions = ["DISPONIBLE", "NO DISPONIBLE"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedEdificio.nombre || ""}
                  onChange={(e) => handleEditField("nombre", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.nombre ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                  required
                />
                {validationErrors.nombre && (
                  <p className="text-red-500 text-sm">Ingresa un nombre.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  value={editedEdificio.dirección || ""}
                  onChange={(e) => handleEditField("dirección", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.dirección ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                  required
                />
                {validationErrors.dirección && (
                  <p className="text-red-500 text-sm">Ingresa una dirección.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sede
                </label>
                <select
                  value={editedEdificio.id_sede || ""}
                  onChange={(e) => handleEditField("id_sede", parseInt(e.target.value))}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.sede ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                  required
                >
                  <option value="">Seleccione una sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.id_sede} value={sede.id_sede}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
                {validationErrors.sede && (
                  <p className="text-red-500 text-sm">Seleccione una sede.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  value={editedEdificio.categoría || ""}
                  onChange={(e) => handleEditField("categoría", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Propiedad
                </label>
                <select
                  value={editedEdificio.propiedad || ""}
                  onChange={(e) => handleEditField("propiedad", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {propiedades.map((propiedad) => (
                    <option key={propiedad} value={propiedad}>
                      {propiedad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Área del Terreno
                </label>
                <input
                  type="number"
                  value={editedEdificio.area_terreno || ""}
                  onChange={(e) => handleEditField("area_terreno", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.area_terreno ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                />
                {validationErrors.area_terreno && (
                  <p className="text-red-500 text-sm">Ingrese un valor positivo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Área Construida
                </label>
                <input
                  type="number"
                  value={editedEdificio.area_construida || ""}
                  onChange={(e) => handleEditField("area_construida", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.area_construida ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                />
                {validationErrors.area_construida && (
                  <p className="text-red-500 text-sm">Ingrese un valor positivo.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Certificado de Uso de Suelo
                </label>
                <select
                  value={editedEdificio.cert_uso_suelo ? "DISPONIBLE" : "NO DISPONIBLE"}
                  onChange={(e) => handleEditField("cert_uso_suelo", e.target.value === "DISPONIBLE")}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                >
                  {certUsoSueloOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo del Titular
                </label>
                <input
                  type="email"
                  list="correos-titulares"
                  value={editedEdificio.correo_titular || ""}
                  onChange={(e) => handleEditField("correo_titular", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.correo_titular ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                  required
                />
                <datalist id="correos-titulares">
                  {users.map((user) => (
                    <option key={user.id_persona} value={user.correo}>
                      {user.correo}
                    </option>
                  ))}
                </datalist>
                {validationErrors.correo_titular && (
                  <p className="text-red-500 text-sm">Ingrese un correo válido y existente.</p>
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
                  <button
                    onClick={handleDeleteClick}
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