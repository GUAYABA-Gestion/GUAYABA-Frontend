"use client";
import { useState } from "react";
import { addUsersManual } from "../../api/UserActions";
import { User, Sede } from "../../../types/api";
import {
  validateCorreo,
  validateTelefono,
  validateTextNotNull,
} from "../../api/validation";

interface AddUserManualProps {
  onClose: () => void;
  onUsersAdded: (newUsers: User[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  sedes: Sede[];
}

const AddUserManual: React.FC<AddUserManualProps> = ({
  onClose,
  onUsersAdded,
  users,
  setUsers,
  sedes,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{
      nombre: boolean;
      correo: boolean;
      telefono: boolean;
      id_sede: boolean;
    }>
  >([]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedUsers = [...users];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [e.target.name]: e.target.value,
    };

    if (e.target.name === "id_sede") {
      const selectedSede = sedes.find(
        (sede) => sede.id_sede === Number(e.target.value)
      );
      updatedUsers[index].sede_nombre = selectedSede?.nombre || "";
    }

    setUsers(updatedUsers);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [e.target.name]: false,
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setUsers([
      ...users,
      {
        nombre: "",
        correo: "",
        telefono: "",
        rol: "user",
        detalles: "",
        id_sede: 0,
        id_persona: 0,
        sede_nombre: "",
        es_manual: true,
      },
    ]);
    setValidationErrors([
      ...validationErrors,
      { nombre: false, correo: false, telefono: false, id_sede: false },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    if (users.length === 0) {
      setError("No hay usuarios para añadir.");
      return;
    }

    const newValidationErrors = users.map((user) => ({
      nombre: !validateTextNotNull(user.nombre),
      correo: !validateCorreo(user.correo),
      telefono: user.telefono ? !validateTelefono(user.telefono) : false,
      id_sede: !user.id_sede || user.id_sede === 0,
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(
      (error) => error.nombre || error.correo || error.telefono || error.id_sede
    );

    if (hasErrors) {
      setError("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      const response = await addUsersManual(users);
      onUsersAdded(response.users);
      setUsers([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      setError(`Error al añadir usuarios: ${error.message}`);
    }
  };

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="overflow-y-auto max-h-[60vh]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Nombre
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[220px]">
                  Correo
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Teléfono
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Rol
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                  Detalles
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                  Sede
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      name="nombre"
                      value={user.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.correo
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="email"
                      name="correo"
                      value={user.correo}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Correo"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.telefono
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      name="telefono"
                      value={user.telefono}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Teléfono (10 dígitos)"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <select
                      name="rol"
                      value={user.rol}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="admin">Administrador</option>
                      <option value="coord">Coordinador</option>
                      <option value="maint">Mantenimiento</option>
                      <option value="user">Usuario</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      name="detalles"
                      value={user.detalles}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Detalles"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.id_sede
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <select
                      name="id_sede"
                      value={user.id_sede}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value={0}>Seleccione una sede</option>
                      {sedes.map((sede) => (
                        <option key={sede.id_sede} value={sede.id_sede}>
                          {sede.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    <button
                      onClick={() => handleRemoveRow(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm w-full"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleAddRow}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm"
      >
        + Añadir Fila
      </button>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
        >
          Guardar Usuarios
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
        >
          Cancelar
        </button>
      </div>

      {Object.values(validationErrors).some((errors) =>
        Object.values(errors).some((error) => error)
      ) && (
        <div className="mt-4 text-red-500 text-sm">
          <ul className="list-disc pl-5">
            {Object.values(validationErrors).some(
              (errors) => errors.nombre
            ) && <li>Nombre: Campo obligatorio</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.correo
            ) && <li>Correo: Formato de correo inválido</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.telefono
            ) && <li>Teléfono: Debe ser un número de 10 cifras</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.id_sede
            ) && <li>Sede: Asegúrese de seleccionar una sede válida</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddUserManual;