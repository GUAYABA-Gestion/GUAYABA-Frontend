"use client";
import { useState, useEffect } from "react";
import { addEdificiosManual } from "../../../api/auth/EdificioActions";
import { Edificio, Sede, User } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber, validateCorreo } from "../../../api/auth/validation";
import { fetchUsers } from "../../../api/auth/UserActions";

interface AddEdificioManualProps {
  isOpen: boolean;
  onClose: () => void;
  sedes: Sede[];
  onEdificiosAdded: (newEdificios: Edificio[]) => void;
  showSuccessMessage: () => void;
  edificios: Edificio[];
  setEdificios: (edificios: Edificio[]) => void;
  users: User[];
}

const AddEdificioManual: React.FC<AddEdificioManualProps> = ({ isOpen, onClose, sedes, onEdificiosAdded, showSuccessMessage, edificios, setEdificios, users }) => {
  const [error, setError] = useState<string | null>(null);
  const [newEdificio, setNewEdificio] = useState<Edificio>({
    nombre: "",
    dirección: "",
    id_sede: 0,
    categoría: "",
    propiedad: "",
    area_terreno: 0,
    area_construida: 0,
    cert_uso_suelo: false,
    id_edificio: 0,
    id_titular: 0,
    correo_titular: "",
    nombre_sede: "",
    nombre_titular: ""
  });

  const [validationErrors, setValidationErrors] = useState<
    Array<{ nombre: boolean; dirección: boolean; id_sede: boolean; area_terreno: boolean; area_construida: boolean; correo_titular: boolean }>
  >([]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedEdificios = [...edificios];
    updatedEdificios[index] = { ...updatedEdificios[index], [e.target.name]: e.target.value };

    if (e.target.name === "id_sede") {
      const selectedSede = sedes.find(sede => sede.id_sede === Number(e.target.value));
      updatedEdificios[index].id_sede = selectedSede?.id_sede || 0;
    }

    setEdificios(updatedEdificios);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [e.target.name]: false
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setEdificios([...edificios, { 
      ...newEdificio,
      id_sede: 0,
    }]);
    setValidationErrors([...validationErrors, { nombre: false, dirección: false, id_sede: false, area_terreno: false, area_construida: false, correo_titular: false }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedEdificios = edificios.filter((_, i) => i !== index);
    setEdificios(updatedEdificios);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    if (edificios.length === 0) {
      alert("No hay edificios para añadir.");
      return;
    }

    const newValidationErrors = edificios.map(edificio => ({
      nombre: !validateTextNotNull(edificio.nombre),
      dirección: !validateTextNotNull(edificio.dirección),
      id_sede: !edificio.id_sede || edificio.id_sede === 0,
      area_terreno: !validatePositiveNumber(edificio.area_terreno),
      area_construida: !validatePositiveNumber(edificio.area_construida),
      correo_titular: edificio.correo_titular ? !validateCorreo(edificio.correo_titular) || !users.some(user => user.correo === edificio.correo_titular) : false,
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(error => 
      error.nombre || error.dirección || error.id_sede || error.area_terreno || error.area_construida || error.correo_titular
    );

    if (hasErrors) {
      alert("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      const response = await addEdificiosManual(edificios);
      onEdificiosAdded(response.edificios);
      showSuccessMessage();
      setEdificios([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      console.error("Error al añadir edificios:", error);
      setError(error.message);
    }
  };

  const handleClose = () => {
    setEdificios([]);
    setError(null);
    setValidationErrors([]);
    onClose();
  };

  const categorias = ["CAT", "PRINCIPAL", "SEDE", "SEDE Y CAT", "OTRO"];
  const propiedades = ["PROPIO", "ARRENDADO", "NO OPERACIONAL"];
  const certUsoSueloOptions = ["DISPONIBLE", "NO DISPONIBLE"];
  const sortedSedes = [...sedes].sort((a, b) => a.id_sede - b.id_sede);

  return (
    <div className="mt-4">
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="overflow-y-auto max-h-60">
          <table className="w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Dirección</th>
                <th className="border border-gray-300 p-2">Sede</th>
                <th className="border border-gray-300 p-2">Categoría</th>
                <th className="border border-gray-300 p-2">Propiedad</th>
                <th className="border border-gray-300 p-2">Área Terreno</th>
                <th className="border border-gray-300 p-2">Área Construida</th>
                <th className="border border-gray-300 p-2">Cert. Uso Suelo</th>
                <th className="border border-gray-300 p-2">Correo Titular</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {edificios.map((edificio, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      name="nombre"
                      value={edificio.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="input text-black w-full"
                    />
                  </td>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.dirección ? "outline outline-red-500" : ""}`}>
                    <input
                      type="text"
                      name="dirección"
                      value={edificio.dirección}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Dirección"
                      className="input text-black w-full"
                    />
                  </td>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.id_sede ? "outline outline-red-500" : ""}`}>
                    <select
                      name="id_sede"
                      value={edificio.id_sede}
                      onChange={(e) => handleInputChange(index, e)}
                      className="input text-black w-full"
                    >
                      <option value={0}>Seleccione una sede</option>
                      {sortedSedes.map((sede) => (
                        <option key={sede.id_sede} value={sede.id_sede}>
                          {sede.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      name="categoría"
                      value={edificio.categoría}
                      onChange={(e) => handleInputChange(index, e)}
                      className="input text-black w-full"
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      name="propiedad"
                      value={edificio.propiedad}
                      onChange={(e) => handleInputChange(index, e)}
                      className="input text-black w-full"
                    >
                      {propiedades.map((propiedad) => (
                        <option key={propiedad} value={propiedad}>
                          {propiedad}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.area_terreno ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="area_terreno"
                      value={edificio.area_terreno}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Área Terreno"
                      className="input text-black w-full"
                    />
                  </td>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.area_construida ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="area_construida"
                      value={edificio.area_construida}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Área Construida"
                      className="input text-black w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      name="cert_uso_suelo"
                      value={edificio.cert_uso_suelo ? "DISPONIBLE" : "NO DISPONIBLE"}
                      onChange={(e) => handleInputChange(index, e)}
                      className="input text-black w-full"
                    >
                      {certUsoSueloOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.correo_titular ? "outline outline-red-500" : ""}`}>
                    <input
                      type="email"
                      list="correos-titulares"
                      name="correo_titular"
                      value={edificio.correo_titular || ""}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Correo Titular"
                      className="input text-black w-full"
                    />
                    <datalist id="correos-titulares">
                      {users.map((user) => (
                        <option key={user.id_persona} value={user.correo}>
                          {user.correo}
                        </option>
                      ))}
                    </datalist>
                    {edificio.correo_titular && (
                      <button
                        onClick={() => handleInputChange(index, { target: { name: "correo_titular", value: "" } } as any)}
                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    )}
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
        </div>

        <button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          + Añadir Fila
        </button>

        <div className="mt-4 flex space-x-4">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar Edificios</button>
          <button onClick={handleClose} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancelar</button>
        </div>

        {Object.values(validationErrors).some((errors) => Object.values(errors).some((error) => error)) && (
          <div className="mt-4 text-red-500">
            <ul>
              {Object.values(validationErrors).some((errors) => errors.nombre) && <li>Nombre: Campo obligatorio</li>}
              {Object.values(validationErrors).some((errors) => errors.dirección) && <li>Dirección: Campo obligatorio</li>}
              {Object.values(validationErrors).some((errors) => errors.id_sede) && <li>Sede: Seleccione una sede válida</li>}
              {Object.values(validationErrors).some((errors) => errors.area_terreno) && <li>Área Terreno: Debe ser un número positivo</li>}
              {Object.values(validationErrors).some((errors) => errors.area_construida) && <li>Área Construida: Debe ser un número positivo</li>}
              {Object.values(validationErrors).some((errors) => errors.correo_titular) && <li>Correo Titular: Debe ser un correo válido y existente</li>}
            </ul>
          </div>
        )}
      </div>
  );
};

export default AddEdificioManual;