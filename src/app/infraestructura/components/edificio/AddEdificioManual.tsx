"use client";
import { useState, useEffect } from "react";
import { addEdificiosManual } from "../../../api/auth/EdificioActions";
import { Edificio, Sede, User } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber, validateCorreo } from "../../../api/auth/validation";
import { fetchUsers } from "../../../api/auth/UserActions";
import { categoriasEdificio, propiedadesEdificio, certUsoSuelo } from "../../../api/auth/desplegableValues";

interface AddEdificioManualProps {
  isOpen: boolean;
  onClose: () => void;
  sedes: Sede[];
  onEdificiosAdded: (newEdificios: Edificio[]) => void;
  showSuccessMessage: () => void;
  edificios: Edificio[];
  setEdificios: (edificios: Edificio[]) => void;
  users: User[];
  rolSimulado: string; // Añadir rolSimulado como prop
  idSede: number | null; // Añadir idSede como prop
}

const AddEdificioManual: React.FC<AddEdificioManualProps> = ({ isOpen, onClose, sedes, onEdificiosAdded, showSuccessMessage, edificios, setEdificios, users, rolSimulado, idSede }) => {
  const [error, setError] = useState<string | null>(null);
  const [newEdificio, setNewEdificio] = useState<Edificio>({
    nombre: "",
    dirección: "",
    id_sede: idSede ?? 0, // Asignar idSede por defecto
    categoría: "",
    propiedad: "",
    area_terreno: 0,
    area_construida: 0,
    cert_uso_suelo: false,
    id_edificio: 0,
    id_titular: null,
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

    if (e.target.name === "correo_titular") {
      const selectedUser = users.find(user => user.correo === e.target.value);
      updatedEdificios[index].id_titular = selectedUser?.id_persona || null;
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
      id_sede: idSede ?? 0, // Asignar idSede por defecto
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
      id_sede: rolSimulado === "coord" && edificio.id_sede !== idSede, // Validar que el id_sede sea el correcto solo si el rol es coordinador
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

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="overflow-y-auto max-h-[60vh]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Nombre</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Dirección</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Sede</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Categoría</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Propiedad</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[140px]">Área Terreno</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[160px]">Área Construida</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Cert. Uso Suelo</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[220px]">Correo Titular</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {edificios.map((edificio, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      name="nombre"
                      value={edificio.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.dirección ? "outline outline-red-500" : ""}`}>
                    <input
                      type="text"
                      name="dirección"
                      value={edificio.dirección}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Dirección"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.id_sede ? "outline outline-red-500" : ""}`}>
                    <select
                      name="id_sede"
                      value={edificio.id_sede}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                      disabled={rolSimulado === "coord"}
                    >
                      {rolSimulado === "coord" ? (
                        <option value={idSede ?? 0}>{sedes.find(sede => sede.id_sede === idSede)?.nombre}</option>
                      ) : (
                        sedes.map((sede) => (
                          <option key={sede.id_sede} value={sede.id_sede}>
                            {sede.nombre}
                          </option>
                        ))
                      )}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <select
                      name="categoría"
                      value={edificio.categoría}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      {categoriasEdificio.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <select
                      name="propiedad"
                      value={edificio.propiedad}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      {propiedadesEdificio.map((propiedad) => (
                        <option key={propiedad} value={propiedad}>
                          {propiedad}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.area_terreno ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="area_terreno"
                      value={edificio.area_terreno}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Área Terreno"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.area_construida ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="area_construida"
                      value={edificio.area_construida}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Área Construida"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <select
                      name="cert_uso_suelo"
                      value={edificio.cert_uso_suelo ? "DISPONIBLE" : "NO DISPONIBLE"}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      {certUsoSuelo.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.correo_titular ? "outline outline-red-500" : ""}`}>
                    <input
                      type="email"
                      list="correos-titulares"
                      name="correo_titular"
                      value={edificio.correo_titular || ""}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Correo Titular"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                    <datalist id="correos-titulares">
                      {users.map((user) => (
                        <option key={user.id_persona} value={user.correo}>
                          {user.correo}
                        </option>
                      ))}
                    </datalist>
                  </td>
                  <td className="border border-gray-300 p-1">
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
          Guardar Edificios
        </button>
        <button 
          onClick={handleClose} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
        >
          Cancelar
        </button>
      </div>
  
      {Object.values(validationErrors).some((errors) => Object.values(errors).some((error) => error)) && (
        <div className="mt-4 text-red-500 text-sm">
          <ul className="list-disc pl-5">
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