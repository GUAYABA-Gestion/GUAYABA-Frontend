import { useState, useEffect } from "react";
import { Sede, User, Espacio } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber } from "../../../api/auth/validation";
import { updateEspacio } from "../../../api/auth/EspacioActions";
import { fetchUsers } from "../../../api/auth/UserActions";

interface EspacioDetailsModalProps {
  espacio: Espacio | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEspacio: Espacio) => void;
  onDelete: (id_espacio: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  editedEspacio: Espacio | null;
  handleEditField: (field: keyof Espacio, value: string | boolean | number) => void;
  showSuccess: boolean;
  sedes: Sede[];
}

const EspacioDetailsModal = ({
  espacio,
  isOpen,
  onClose,
  onSave,
  onDelete,
  editMode,
  setEditMode,
  editedEspacio,
  handleEditField,
  showSuccess,
  sedes
}: EspacioDetailsModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    nombre: false,
    estado: false,
    clasificacion: false,
    capacidad: false,
    mediciónmt2: false
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  if (!isOpen || !espacio || !editedEspacio) return null;

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(espacio.id_espacio);
    setConfirmDelete(false);
  };
 
  const handleSave = async () => {
    const errors = {
      nombre: !validateTextNotNull(editedEspacio.nombre),
      estado: !validateTextNotNull(editedEspacio.estado),
      clasificacion: !editedEspacio.clasificacion,
      capacidad: !validatePositiveNumber(editedEspacio.capacidad),
      mediciónmt2: !validatePositiveNumber(editedEspacio.mediciónmt2)
    };
  
    setValidationErrors(errors);
  
    if (Object.values(errors).some((error) => error)) {
      alert("Por favor corrija los errores antes de guardar.");
      return;
    }
  
    const updatedEspacio = await updateEspacio({
      ...editedEspacio
    });
    if (updatedEspacio) {
      onSave({
        ...updatedEspacio
      });
    }
  };

  const handleClose = () => {
    setValidationErrors({
      nombre: false,
      estado: false,
      clasificacion: false,
      capacidad: false,
      mediciónmt2: false
    });
    onClose();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    handleClose();
  };

  const estadoOptions = ["En funcionamiento", "Funcionamiento Parcial", "No Funciona", "Deshabilitado"];
  const clasificacionOptions = ["Edificio/Bloque", "Parqueadero", "Planta tratamiento agua", "Portería", "Unidad almacenamiento residuos", "Zona Deportiva","Campus","Pozo Séptico"];
  const usoOptions = ["Académico","Académico-Administrativo","Administrativo","Área común","Bienestar Universitario","Docencia","Extensión","Investigación"];
  const tipoOptions = ["Anfiteatro Humanos","Anfiteatro Animales","Auditorio","Aula/salón","Baño Hombres","Baño Mixto","Baño Mujeres","Baño PMV","Biblioteca","Bodega","Cafeteria","Camerino","Cancha de juegos","Consultorio","Laboratorio","Laboratorio simulacion","Local","Oficina","Otro (desciba en observacion)","Sala de computo","Sala de tutores","Salon de juegos","Z_Otro"]
  const pisoOptions = ["Primer Piso", "Segundo Piso","Tercer Piso","Cuarto Piso","Quinto Piso","Sexto Piso","Séptimo Piso","Octavo Piso","Noveno Piso","Décimo Piso","Campus","Sótano","Terraza","Cubierta","Z_General"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        {confirmDelete ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p>ELIMINAR ESPACIO</p>
            <p className="font-bold">{espacio.nombre}</p>
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
              Detalles del Espacio
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedEspacio.nombre || ""}
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
                  Estado
                </label>
                <select
                  value={editedEspacio.estado || "En funcionamiento" || "Funcionamiento Parcial" || "No Funciona" || "Deshabilitado" }
                  onChange={(e) => handleEditField("estado", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                  required
                >
                  {estadoOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Clasifiación
                </label>
                <select
                  value={editedEspacio.clasificacion || "Edificio/Bloque" || "Parqueadero" || "Planta tratamiento agua" || "Portería" || "Unidad almacenamiento residuos" || "Zona Deportiva" || "Campus" || "Pozo Séptico" }
                  onChange={(e) => handleEditField("clasificacion", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                  required
                >
                  {clasificacionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Uso
                </label>
                <select
                  value={editedEspacio.uso || "Académico" || "Académico-Administrativo" || "Administrativo" || "Área común" || "Bienestar Universitario" || "Docencia" || "Extensión" || "Investigación"}
                  onChange={(e) => handleEditField("uso", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                  required
                >
                  {usoOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={editedEspacio.tipo || "Anfiteatro Humanos" || "Anfiteatro Animales" || "Auditorio" || "Aula/salón" || "Baño Hombres" || "Baño Mixto" || "Baño Mujeres" || "Baño PMV" ||  
                    "Biblioteca" || "Bodega" || "Cafeteria" || "Camerino" || "Cancha de juegos" || "Consultorio" || "Laboratorio" ||  
                    "Laboratorio simulacion" || "Local" || "Oficina" || "Otro (desciba en observacion)" || "Sala de computo" ||  
                    "Sala de tutores" || "Salon de juegos" || "Z_Otro"}
                  onChange={(e) => handleEditField("tipo", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                  required
                >
                  {tipoOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Piso
                </label>
                <select
                  value={editedEspacio.piso || "Primer Piso" || "Segundo Piso" || "Tercer Piso" || "Cuarto Piso" || "Quinto Piso" || "Sexto Piso" ||  
                    "Séptimo Piso" || "Octavo Piso" || "Noveno Piso" || "Décimo Piso" || "Campus" || "Sótano" ||  
                    "Terraza" || "Cubierta" || "Z_General"
                  }
                  onChange={(e) => handleEditField("piso", e.target.value)}
                  className="mt-1 p-2 border rounded w-full text-black"
                  disabled={!editMode}
                  required
                >
                  {pisoOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacidad
                </label>
                <input
                  type="text"
                  value={editedEspacio.capacidad || ""}
                  onChange={(e) => handleEditField("capacidad", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.capacidad ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                  required
                />
                {validationErrors.capacidad && (
                  <p className="text-red-500 text-sm">Ingresa una capadidad válida.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacidad
                </label>
                <input
                  type="text"
                  value={editedEspacio.mediciónmt2 || ""}
                  onChange={(e) => handleEditField("mediciónmt2", e.target.value)}
                  className={`mt-1 p-2 border rounded w-full text-black ${
                    validationErrors.mediciónmt2 ? "outline outline-red-500" : ""
                  }`}
                  disabled={!editMode}
                  required
                />
                {validationErrors.mediciónmt2 && (
                  <p className="text-red-500 text-sm">Ingresa una medición de mt2 válida.</p>
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

export default EspacioDetailsModal;