"use client";
import { useState } from "react";
import Papa from "papaparse";
import { addUsersManual } from "../components/UserActions";
import { User, Sede } from "../../../types/api";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  sedes: Sede[];
  onUsersAdded: (newUsers: User[]) => void;
  showSuccessMessage: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, sedes, onUsersAdded, showSuccessMessage }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    nombre: "",
    correo: "",
    telefono: "",
    rol: "user",
    detalles: "",
    id_sede: 0, // Valor por defecto cambiado a 0
    id_persona: 0,
    sede_nombre: "",
    es_manual: true,
  });

  // Cambiamos a un array de errores por fila
  const [validationErrors, setValidationErrors] = useState<
    Array<{ correo: boolean; telefono: boolean; id_sede: boolean }>
  >([]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], [e.target.name]: e.target.value };

    // Actualizar nombre de sede si cambia id_sede
    if (e.target.name === "id_sede") {
      const selectedSede = sedes.find(sede => sede.id_sede === Number(e.target.value));
      updatedUsers[index].sede_nombre = selectedSede?.nombre || "";
    }

    setUsers(updatedUsers);

    // Limpiar error específico de la fila
    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [e.target.name]: false
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setUsers([...users, { 
      ...newUser,
      id_sede: 0, // Valor por defecto para nuevas filas
      sede_nombre: "" 
    }]);
    setValidationErrors([...validationErrors, { correo: false, telefono: false, id_sede: false }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);

    // Remove validation errors for the removed row
    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedUsers: User[] = result.data.map((row: any) => ({
          nombre: row.nombre || "",
          correo: row.correo || "",
          telefono: row.telefono || "",
          rol: row.rol || "user",
          detalles: row.detalles || "",
          id_sede: Number(row.id_sede) || 0,
          id_persona: 0,
          sede_nombre: sedes.find(sede => sede.id_sede === Number(row.id_sede))?.nombre || "",
          es_manual: true,
        }));

        if (parsedUsers.some(user => !/^\d{10}$/.test(user.telefono))) {
          alert("Uno o más usuarios tienen teléfonos inválidos.");
          return;
        }

        setUsers([...users, ...parsedUsers]);
        setValidationErrors([...validationErrors, ...parsedUsers.map(() => ({ correo: false, telefono: false, id_sede: false }))]);
      },
      error: (err) => console.error("Error al leer CSV:", err.message),
    });
  };

  const handleSubmit = async () => {
    if (users.length === 0) {
      alert("No hay usuarios para añadir.");
      return;
    }

    // Validar cada fila individualmente
    const newValidationErrors = users.map(user => ({
      correo: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.correo),
      telefono: !/^\d{10}$/.test(user.telefono),
      id_sede: !user.id_sede || user.id_sede === 0
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(error => 
      error.correo || error.telefono || error.id_sede
    );

    if (hasErrors) {
      alert("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      const response = await addUsersManual(users);
      onUsersAdded(response.users);
      showSuccessMessage();
      setUsers([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      console.error("Error al añadir usuarios:", error);
      setError(error.message);
    }
  };

  const handleClose = () => {
    setUsers([]);
    setError(null);
    setValidationErrors([]);
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${isOpen ? "visible" : "invisible"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Usuarios</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <table className="w-full border-collapse border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-[#80BA7F] text-white">
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Correo</th>
              <th className="border border-gray-300 p-2">Teléfono</th>
              <th className="border border-gray-300 p-2">Rol</th>
              <th className="border border-gray-300 p-2">Detalles</th>
              <th className="border border-gray-300 p-2">Sede</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="nombre"
                    value={user.nombre}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Nombre"
                    className="input text-black w-full"
                  />
                </td>
                <td className={`border border-gray-300 p-2 ${validationErrors[index]?.correo ? "outline outline-red-500" : ""}`}>
                  <input
                    type="email"
                    name="correo"
                    value={user.correo}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Correo"
                    className="input text-black w-full"
                  />
                </td>
                <td className={`border border-gray-300 p-2 ${validationErrors[index]?.telefono ? "outline outline-red-500" : ""}`}>
                  <input
                    type="text"
                    name="telefono"
                    value={user.telefono}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Teléfono (10 dígitos)"
                    className="input text-black w-full"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    name="rol"
                    value={user.rol}
                    onChange={(e) => handleInputChange(index, e)}
                    className="input text-black w-full"
                  >
                    <option value="admin">Administrador</option>
                    <option value="coord">Coordinador</option>
                    <option value="maint">Mantenimiento</option>
                    <option value="user">Usuario</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    name="detalles"
                    value={user.detalles}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Detalles"
                    className="input text-black w-full"
                  />
                </td>
                <td className={`border border-gray-300 p-2 ${validationErrors[index]?.id_sede ? "outline outline-red-500" : ""}`}>
                  <select
                    name="id_sede"
                    value={user.id_sede}
                    onChange={(e) => handleInputChange(index, e)}
                    className="input text-black w-full"
                  >
                    <option value={0}>Seleccione una sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.id_sede} value={sede.id_sede}>
                        {sede.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          + Añadir Fila
        </button>

        <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4 text-black" />

        <div className="mt-4 flex space-x-4">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar Usuarios</button>
          <button onClick={handleClose} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancelar</button>
        </div>

        {Object.values(validationErrors).some((errors) => Object.values(errors).some((error) => error)) && (
          <div className="mt-4 text-red-500">
            <ul>
              {Object.values(validationErrors).some((errors) => errors.correo) && <li>Correo: Formato de correo inválido</li>}
              {Object.values(validationErrors).some((errors) => errors.telefono) && <li>Teléfono: Debe ser un número de 10 cifras</li>}
              {Object.values(validationErrors).some((errors) => errors.id_sede) && <li>Sede: Asegúrese de seleccionar una sede válida</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserModal;