"use client";
import { useState, useEffect } from "react";
import { Edificio, Sede, User } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber, validateCorreo } from "../../../api/auth/validation";
import { fetchUsers } from "../../../api/auth/UserActions";

interface EdificioDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  edificio: Edificio;
  sedes: Sede[];
  onSave: (edificio: Edificio) => void;
  onDelete: (id_edificio: number) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  editedEdificio: Edificio;
  handleEditField: (field: string, value: any) => void;
  showSuccess: boolean;
}

const EdificioDetailsModal: React.FC<EdificioDetailsModalProps> = ({
  isOpen,
  onClose,
  edificio,
  sedes,
  onSave,
  onDelete,
  editMode,
  setEditMode,
  editedEdificio,
  handleEditField,
  showSuccess,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const handleSave = () => {
    const validationErrors = {
      nombre: !validateTextNotNull(editedEdificio.nombre),
      dirección: !validateTextNotNull(editedEdificio.dirección),
      id_sede: !editedEdificio.id_sede || editedEdificio.id_sede === 0,
      area_terreno: !validatePositiveNumber(editedEdificio.area_terreno),
      area_construida: !validatePositiveNumber(editedEdificio.area_construida),
      correo_titular: editedEdificio.correo_titular ? !validateCorreo(editedEdificio.correo_titular) || !users.some(user => user.correo === editedEdificio.correo_titular) : false,
    };

    if (Object.values(validationErrors).some(error => error)) {
      setError("Por favor corrija los errores antes de guardar.");
      return;
    }

    onSave(editedEdificio);
    setEditMode(false);
  };

  const handleDeleteTitular = () => {
    handleEditField("correo_titular", "");
  };

  if (!isOpen || !edificio || !editedEdificio) return null;

  const categorias = ["CAT", "PRINCIPAL", "SEDE", "SEDE Y CAT", "OTRO"];
  const propiedades = ["PROPIO", "ARRENDADO", "NO OPERACIONAL"];
  const certUsoSueloOptions = ["DISPONIBLE", "NO DISPONIBLE"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Detalles del Edificio</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={editedEdificio.nombre}
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
              value={editedEdificio.dirección}
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
              value={editedEdificio.id_sede}
              onChange={(e) => handleEditField("id_sede", Number(e.target.value))}
              className={`mt-1 p-2 border rounded w-full text-black ${!editedEdificio.id_sede || editedEdificio.id_sede === 0 ? "outline outline-red-500" : ""}`}
              disabled={!editMode}
            >
              <option value={0}>Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id_sede} value={sede.id_sede}>
                  {sede.nombre}
                </option>
              ))}
            </select>
            {(!editedEdificio.id_sede || editedEdificio.id_sede === 0) && (
              <p className="text-red-500 text-sm">Debe seleccionar una sede.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={editedEdificio.categoría}
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
            <label className="block text-sm font-medium text-gray-700">Propiedad</label>
            <select
              value={editedEdificio.propiedad}
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
            <label className="block text-sm font-medium text-gray-700">Área Terreno</label>
            <input
              type="number"
              value={editedEdificio.area_terreno}
              onChange={(e) => handleEditField("area_terreno", Number(e.target.value))}
              className={`mt-1 p-2 border rounded w-full text-black ${!validatePositiveNumber(editedEdificio.area_terreno) ? "outline outline-red-500" : ""}`}
              disabled={!editMode}
            />
            {!validatePositiveNumber(editedEdificio.area_terreno) && (
              <p className="text-red-500 text-sm">Área Terreno debe ser un número positivo.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Área Construida</label>
            <input
              type="number"
              value={editedEdificio.area_construida}
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
            <label className="block text-sm font-medium text-gray-700">Correo Titular</label>
            <input
              type="email"
              list="correos-titulares"
              value={editedEdificio.correo_titular || ""}
              onChange={(e) => handleEditField("correo_titular", e.target.value)}
              className={`mt-1 p-2 border rounded w-full text-black ${editedEdificio.correo_titular && !validateCorreo(editedEdificio.correo_titular) ? "outline outline-red-500" : ""}`}
              disabled={!editMode}
            />
            <datalist id="correos-titulares">
              {users.map((user) => (
                <option key={user.id_persona} value={user.correo}>
                  {user.correo}
                </option>
              ))}
            </datalist>
            {editedEdificio.correo_titular && !validateCorreo(editedEdificio.correo_titular) && (
              <p className="text-red-500 text-sm">Correo Titular debe ser un correo válido.</p>
            )}
            {editedEdificio.correo_titular && editMode && (
              <button
                onClick={handleDeleteTitular}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
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
                onClick={() => onDelete(edificio.id_edificio)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EdificioDetailsModal;