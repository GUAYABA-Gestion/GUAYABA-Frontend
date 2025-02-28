"use client";

import { useState } from "react";
import { Espacio } from "../../../../types/api";
import { estadosEspacio, clasificacionesEspacio, usosEspacio, tiposEspacio, pisosEspacio } from "../../../api/desplegableValues";
import { validateTextNotNull, validatePositiveNumber } from "../../../api/validation";
import { addEspaciosManual } from "../../../api/EspacioActions";

interface AddEspacioManualProps {
  isOpen: boolean;
  onClose: () => void;
  onEspaciosAdded: (newEspacios: Espacio[]) => void;
  espacios: Espacio[];
  setEspacios: (espacios: Espacio[]) => void;
  idEdificio: number; // Añadir idEdificio como prop
}

const AddEspacioManual: React.FC<AddEspacioManualProps> = ({ isOpen, onClose, onEspaciosAdded, espacios, setEspacios, idEdificio }) => {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ nombre: boolean; estado: boolean; clasificacion: boolean; uso: boolean; tipo: boolean; piso: boolean; capacidad: boolean; mediciónmt2: boolean }>
  >([]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedEspacios = [...espacios];
    updatedEspacios[index] = { ...updatedEspacios[index], [e.target.name]: e.target.value };

    setEspacios(updatedEspacios);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [e.target.name]: false
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setEspacios([...espacios, {
      id_espacio: 0,
      id_edificio: idEdificio, // Asignar idEdificio
      nombre: "",
      estado: "",
      clasificacion: "",
      uso: "",
      tipo: "",
      piso: "",
      capacidad: 0,
      mediciónmt2: 0,
    }]);
    setValidationErrors([...validationErrors, { nombre: false, estado: false, clasificacion: false, uso: false, tipo: false, piso: false, capacidad: false, mediciónmt2: false }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedEspacios = espacios.filter((_, i) => i !== index);
    setEspacios(updatedEspacios);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    if (espacios.length === 0) {
      setError("No hay espacios para añadir.");
      return;
    }

    const newValidationErrors = espacios.map(espacio => ({
      nombre: !validateTextNotNull(espacio.nombre),
      estado: !validateTextNotNull(espacio.estado),
      clasificacion: !validateTextNotNull(espacio.clasificacion),
      uso: !validateTextNotNull(espacio.uso),
      tipo: !validateTextNotNull(espacio.tipo),
      piso: !validateTextNotNull(espacio.piso),
      capacidad: !validatePositiveNumber(espacio.capacidad),
      mediciónmt2: !validatePositiveNumber(espacio.mediciónmt2),
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(error =>
      error.nombre || error.estado || error.clasificacion || error.uso || error.tipo || error.piso || error.capacidad || error.mediciónmt2
    );

    if (hasErrors) {
      setError("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      console.log(espacios);
      const response = await addEspaciosManual(espacios);
      const addedEspacios = response.espacios;
      onEspaciosAdded(addedEspacios);
      setEspacios([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      setError(`Error al añadir espacios: ${error.message}`);
    }
  };

  const handleClose = () => {
    setEspacios([]);
    setError(null);
    setValidationErrors([]);
    onClose();
  };

  return (
    <div className="mt-4">
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      <div className="overflow-y-auto max-h-[60vh]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Nombre</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Estado</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Clasificación</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Uso</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Tipo</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[160px]">Piso</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[100px]">Capacidad</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[100px]">Medición (m²)</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {espacios.map((espacio, index) => (
                <tr key={index}>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.nombre ? "outline outline-red-500" : ""}`}>
                    <input
                      type="text"
                      name="nombre"
                      value={espacio.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.estado ? "outline outline-red-500" : ""}`}>
                    <select
                      name="estado"
                      value={espacio.estado}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un estado</option>
                      {estadosEspacio.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.clasificacion ? "outline outline-red-500" : ""}`}>
                    <select
                      name="clasificacion"
                      value={espacio.clasificacion}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione una clasificación</option>
                      {clasificacionesEspacio.map((clasificacion) => (
                        <option key={clasificacion} value={clasificacion}>
                          {clasificacion}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.uso ? "outline outline-red-500" : ""}`}>
                    <select
                      name="uso"
                      value={espacio.uso}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un uso</option>
                      {usosEspacio.map((uso) => (
                        <option key={uso} value={uso}>
                          {uso}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.tipo ? "outline outline-red-500" : ""}`}>
                    <select
                      name="tipo"
                      value={espacio.tipo}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposEspacio.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.piso ? "outline outline-red-500" : ""}`}>
                    <select
                      name="piso"
                      value={espacio.piso}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un piso</option>
                      {pisosEspacio.map((piso) => (
                        <option key={piso} value={piso}>
                          {piso}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.capacidad ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="capacidad"
                      value={espacio.capacidad}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Capacidad"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.mediciónmt2 ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="mediciónmt2"
                      value={espacio.mediciónmt2}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Medición (m²)"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
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
          Guardar Espacios
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
            {Object.values(validationErrors).some((errors) => errors.estado) && <li>Estado: Seleccione un estado válido</li>}
            {Object.values(validationErrors).some((errors) => errors.clasificacion) && <li>Clasificación: Seleccione una clasificación válida</li>}
            {Object.values(validationErrors).some((errors) => errors.uso) && <li>Uso: Seleccione un uso válido</li>}
            {Object.values(validationErrors).some((errors) => errors.tipo) && <li>Tipo: Seleccione un tipo válido</li>}
            {Object.values(validationErrors).some((errors) => errors.piso) && <li>Piso: Seleccione un piso válido</li>}
            {Object.values(validationErrors).some((errors) => errors.capacidad) && <li>Capacidad: Debe ser un número positivo</li>}
            {Object.values(validationErrors).some((errors) => errors.mediciónmt2) && <li>Medición (m²): Debe ser un número positivo</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddEspacioManual;