"use client";
import { useState } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { addUsersManual } from "../../api/auth/UserActions";
import { User, Sede } from "../../../types/api";
import {
  validateCorreo,
  validateTelefono,
  validateTextNotNull,
} from "../../api/auth/validation";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  sedes: Sede[];
  onUsersAdded: (newUsers: User[]) => void;
  showSuccessMessage: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  sedes,
  onUsersAdded,
  showSuccessMessage,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    nombre: "",
    correo: "",
    telefono: "",
    rol: "user",
    detalles: "",
    id_sede: 0,
    id_persona: 0,
    sede_nombre: "",
    es_manual: true,
  });
  const [showCsvInfo, setShowCsvInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        ...newUser,
        id_sede: 0,
        sede_nombre: "",
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

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
          sede_nombre:
            sedes.find((sede) => sede.id_sede === Number(row.id_sede))
              ?.nombre || "",
          es_manual: true,
        }));

        if (parsedUsers.some((user) => !/^\d{10}$/.test(user.telefono))) {
          alert("Uno o más usuarios tienen teléfonos inválidos.");
          return;
        }

        setUsers([...users, ...parsedUsers]);
        setValidationErrors([
          ...validationErrors,
          ...parsedUsers.map(() => ({
            nombre: false,
            correo: false,
            telefono: false,
            id_sede: false,
          })),
        ]);
      },
      error: (err) => console.error("Error al leer CSV:", err.message),
    });
  };

  const handleSubmit = async () => {
    if (users.length === 0) {
      alert("No hay usuarios para añadir.");
      return;
    }

    const newValidationErrors = users.map((user) => ({
      nombre: !validateTextNotNull(user.nombre),
      correo: !validateCorreo(user.correo),
      telefono: !validateTelefono(user.telefono),
      id_sede: !user.id_sede || user.id_sede === 0,
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(
      (error) => error.nombre || error.correo || error.telefono || error.id_sede
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
    setShowCsvInfo(false);
    setSelectedFile(null);
    onClose();
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Usuarios");

    worksheet.columns = [
      { header: "nombre", key: "nombre", width: 20 },
      { header: "correo", key: "correo", width: 30 },
      { header: "telefono", key: "telefono", width: 15 },
      { header: "rol", key: "rol", width: 15 },
      { header: "detalles", key: "detalles", width: 30 },
      { header: "id_sede", key: "id_sede", width: 10 },
    ];

    worksheet.addRow([
      "Nombre Ejemplo",
      "ejemplo@correo.com",
      "1234567890",
      "user",
      "Detalles Ejemplo",
      1,
    ]);

    worksheet.getCell("A1").note = "Nombre: Nombre del usuario";
    worksheet.getCell("B1").note = "Correo: Correo electrónico del usuario";
    worksheet.getCell("C1").note = "Teléfono: Número de teléfono de 10 dígitos";
    worksheet.getCell("D1").note =
      'Rol: Puede ser "admin", "coord", "maint" o "user"';
    worksheet.getCell("E1").note =
      "Detalles: Detalles adicionales sobre el usuario";
    worksheet.getCell("F1").note =
      "ID de la sede. Los IDs de las sedes disponibles son: " +
      sedes.map((sede) => `${sede.id_sede}: ${sede.nombre}`).join(", ");

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "user_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedSedes = [...sedes].sort((a, b) => a.id_sede - b.id_sede);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Usuarios</h2>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

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
                        {sortedSedes.map((sede) => (
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

        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
          >
            Guardar Usuarios
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCsvInfo}
              onChange={() => setShowCsvInfo(!showCsvInfo)}
              className="mr-2"
            />
            <span className="text-black text-sm">
              Mostrar opciones de carga por CSV
            </span>
          </label>
        </div>

        {showCsvInfo && (
          <>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-4 text-black text-sm"
            />

            <button
              onClick={handleDownloadTemplate}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 text-sm"
            >
              Descargar Plantilla Excel
            </button>

            <div className="mt-4 text-black text-sm">
              <p>
                <b>
                  Por favor, guarde el archivo como CSV UTF-8 antes de subirlo.
                </b>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddUserModal;
