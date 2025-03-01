"use client";
import { useState } from "react";
import { Mantenimiento, User } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber } from "../../../api/validation";
import { estadosMantenimiento, tiposMantenimiento, prioridadesMantenimiento, necesidadesMantenimiento, tiposContratoMantenimiento } from "../../../api/desplegableValues";
import { addMantenimientosManual } from "../../../api/MantenimientoActions";

interface AddMantenimientoManualProps {
  onClose: () => void;
  onMantenimientosAdded: (newMantenimientos: Mantenimiento[]) => void;
  mantenimientos: Mantenimiento[];
  setMantenimientos: (mantenimientos: Mantenimiento[]) => void;
  maints: User[];
  idEspacio: number;
}

const AddMantenimientoManual: React.FC<AddMantenimientoManualProps> = ({
  onClose,
  onMantenimientosAdded,
  mantenimientos,
  setMantenimientos,
  maints,
  idEspacio,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ plazo_ideal: boolean; tipo_contrato: boolean; tipo: boolean; estado: boolean; necesidad: boolean; prioridad: boolean }>
  >([]);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const updatedMantenimientos = [...mantenimientos];
    const { name, value } = e.target;

    updatedMantenimientos[index] = { ...updatedMantenimientos[index], [name]: value };

    if (name === "id_encargado") {
      const selectedUser = maints.find(user => user.id_persona === Number(value));
      updatedMantenimientos[index].id_encargado = selectedUser?.id_persona || null;
    }

    setMantenimientos(updatedMantenimientos);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [name]: false
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setMantenimientos([...mantenimientos, { 
      id_mantenimiento: 0,
      id_espacio: idEspacio,
      id_encargado: null,
      tipo_contrato: "",
      tipo: "",
      estado: "",
      necesidad: "",
      prioridad: "",
      detalle: "",
      fecha_asignacion: "",
      plazo_ideal: 0,
      terminado: false,
      observación: "",
    }]);
    setValidationErrors([...validationErrors, { plazo_ideal: false, tipo_contrato: false, tipo: false, estado: false, necesidad: false, prioridad: false }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedMantenimientos = mantenimientos.filter((_, i) => i !== index);
    setMantenimientos(updatedMantenimientos);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    if (mantenimientos.length === 0) {
      setError("No hay mantenimientos para añadir.");
      return;
    }

    const newValidationErrors = mantenimientos.map(mantenimiento => ({
      plazo_ideal: !validatePositiveNumber(Number(mantenimiento.plazo_ideal)),
      tipo_contrato: mantenimiento.tipo_contrato === "",
      tipo: mantenimiento.tipo === "",
      estado: mantenimiento.estado === "",
      necesidad: mantenimiento.necesidad === "",
      prioridad: mantenimiento.prioridad === "",
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(error => 
      error.plazo_ideal || error.tipo_contrato || error.tipo || error.estado || error.necesidad || error.prioridad
    );

    if (hasErrors) {
      setError("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      const data = await addMantenimientosManual(mantenimientos);
      onMantenimientosAdded(data);
      setMantenimientos([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      setError("Error al añadir mantenimientos: " + error.message);
    }
  };

  const handleClose = () => {
    setMantenimientos([]);
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
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Encargado</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Tipo Contrato</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Tipo</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Estado</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Necesidad</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">Prioridad</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Detalle</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Fecha de Asignación</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Plazo Ideal (días)</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Terminado</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">Observación</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((mantenimiento, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1">
                    <select
                      name="id_encargado"
                      value={mantenimiento.id_encargado || ""}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un encargado</option>
                      {maints.map((maint) => (
                        <option key={maint.id_persona} value={maint.id_persona}>
                          {maint.nombre} ({maint.correo})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.tipo_contrato ? "outline outline-red-500" : ""}`}>
                    <select
                      name="tipo_contrato"
                      value={mantenimiento.tipo_contrato}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un tipo de contrato</option>
                      {tiposContratoMantenimiento.map((tipo_contrato) => (
                        <option key={tipo_contrato} value={tipo_contrato}>
                          {tipo_contrato}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.tipo ? "outline outline-red-500" : ""}`}>
                    <select
                      name="tipo"
                      value={mantenimiento.tipo}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposMantenimiento.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.estado ? "outline outline-red-500" : ""}`}>
                    <select
                      name="estado"
                      value={mantenimiento.estado}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un estado</option>
                      {estadosMantenimiento.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.necesidad ? "outline outline-red-500" : ""}`}>
                    <select
                      name="necesidad"
                      value={mantenimiento.necesidad}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione una necesidad</option>
                      {necesidadesMantenimiento.map((necesidad) => (
                        <option key={necesidad} value={necesidad}>
                          {necesidad}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.prioridad ? "outline outline-red-500" : ""}`}>
                    <select
                      name="prioridad"
                      value={mantenimiento.prioridad}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione una prioridad</option>
                      {prioridadesMantenimiento.map((prioridad) => (
                        <option key={prioridad} value={prioridad}>
                          {prioridad}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1`}>
                    <input
                      type="text"
                      name="detalle"
                      value={mantenimiento.detalle}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Detalle"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="date"
                      name="fecha_asignacion"
                      value={mantenimiento.fecha_asignacion}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.plazo_ideal ? "outline outline-red-500" : ""}`}>
                    <input
                      type="number"
                      name="plazo_ideal"
                      value={mantenimiento.plazo_ideal}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Plazo Ideal"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <select
                      name="terminado"
                      value={mantenimiento.terminado ? "true" : "false"}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <textarea
                      name="observación"
                      value={mantenimiento.observación}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Observación"
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
          Guardar Mantenimientos
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
            {Object.values(validationErrors).some((errors) => errors.plazo_ideal) && <li>Plazo Ideal: Debe ser un número positivo</li>}
            {Object.values(validationErrors).some((errors) => errors.tipo_contrato) && <li>Tipo Contrato: Campo obligatorio</li>}
            {Object.values(validationErrors).some((errors) => errors.tipo) && <li>Tipo: Campo obligatorio</li>}
            {Object.values(validationErrors).some((errors) => errors.estado) && <li>Estado: Campo obligatorio</li>}
            {Object.values(validationErrors).some((errors) => errors.necesidad) && <li>Necesidad: Campo obligatorio</li>}
            {Object.values(validationErrors).some((errors) => errors.prioridad) && <li>Prioridad: Campo obligatorio</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddMantenimientoManual;