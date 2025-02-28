"use client";

import { useState } from "react";
import { Evento, Programa } from "../../../../types/api";
import { tiposEvento } from "../../../api/desplegableValues";
import { addEventosManual } from "../../../api/EventoActions";
import { validateTextNotNull } from "../../../api/validation";

interface AddEventoManualProps {
  onClose: () => void;
  onEventosAdded: (newEventos: Evento[]) => void;
  eventos: Evento[];
  setEventos: (eventos: Evento[]) => void;
  programas: Programa[];
  idEspacio: number;
}

const AddEventoManual: React.FC<AddEventoManualProps> = ({
  onClose,
  onEventosAdded,
  eventos,
  setEventos,
  programas,
  idEspacio,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Array<{
      nombre: boolean;
      tipo: boolean;
      id_programa: boolean;
      fecha_inicio: boolean;
      fecha_fin: boolean;
      hora_inicio: boolean;
      hora_fin: boolean;
      días: boolean;
    }>
  >([]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedEventos = [...eventos];
    const { name, value } = e.target;

    updatedEventos[index] = { ...updatedEventos[index], [name]: value };

    setEventos(updatedEventos);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [name]: false,
    };
    setValidationErrors(updatedErrors);
  };

  const handleTextareaChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const updatedEventos = [...eventos];
    const { name, value } = e.target;

    updatedEventos[index] = { ...updatedEventos[index], [name]: value };

    setEventos(updatedEventos);
  };

  const handleDayChange = (index: number, day: string) => {
    const updatedEventos = [...eventos];
    const newDias = updatedEventos[index].días.includes(day)
      ? updatedEventos[index].días.replace(day, "")
      : updatedEventos[index].días + day;
    updatedEventos[index].días = newDias;
    setEventos(updatedEventos);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      días: false,
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setEventos([
      ...eventos,
      {
        id_evento: 0,
        id_espacio: idEspacio,
        tipo: "",
        nombre: "",
        descripcion: "",
        id_programa: 0,
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "",
        hora_fin: "",
        días: "",
        estado: "pendiente",
      },
    ]);
    setValidationErrors([
      ...validationErrors,
      {
        nombre: false,
        tipo: false,
        id_programa: false,
        fecha_inicio: false,
        fecha_fin: false,
        hora_inicio: false,
        hora_fin: false,
        días: false,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedEventos = eventos.filter((_, i) => i !== index);
    setEventos(updatedEventos);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    if (eventos.length === 0) {
      setError("No hay eventos para añadir.");
      return;
    }

    const newValidationErrors = eventos.map((evento) => ({
      nombre: !validateTextNotNull(evento.nombre),
      tipo: evento.tipo === "",
      id_programa: evento.id_programa === 0,
      fecha_inicio: evento.fecha_inicio === "",
      fecha_fin: evento.fecha_fin === "",
      hora_inicio: evento.hora_inicio === "",
      hora_fin: evento.hora_fin === "",
      días: evento.días === "",
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(
      (error) =>
        error.nombre ||
        error.tipo ||
        error.id_programa ||
        error.fecha_inicio ||
        error.fecha_fin ||
        error.hora_inicio ||
        error.hora_fin ||
        error.días
    );

    if (hasErrors) {
      setError("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      // Aquí deberías llamar a la función para añadir eventos manualmente
      const response = await addEventosManual(eventos);
      onEventosAdded(response);
      setEventos([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      setError(`Error al añadir eventos: ${error.message}`);
    }
  };

  const handleClose = () => {
    setEventos([]);
    setError(null);
    setValidationErrors([]);
    onClose();
  };

  const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];

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
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Tipo
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Programa
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Fecha de Inicio
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Hora de Inicio
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Fecha de Fin
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Hora de Fin
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Descripción
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[180px]">
                  Días
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[120px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento, index) => (
                <tr key={index}>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.nombre
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      name="nombre"
                      value={evento.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.tipo
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <select
                      name="tipo"
                      value={evento.tipo}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposEvento.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.id_programa
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <select
                      name="id_programa"
                      value={evento.id_programa}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value="">Seleccione un programa</option>
                      {programas.map((programa) => (
                        <option key={programa.id_programa} value={programa.id_programa}>
                          {programa.programa_nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.fecha_inicio
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={evento.fecha_inicio}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Fecha de Inicio"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.hora_inicio
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="time"
                      name="hora_inicio"
                      value={evento.hora_inicio}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Hora de Inicio"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.fecha_fin
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="date"
                      name="fecha_fin"
                      value={evento.fecha_fin}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Fecha de Fin"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.hora_fin
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <input
                      type="time"
                      name="hora_fin"
                      value={evento.hora_fin}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Hora de Fin"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <textarea
                      name="descripcion"
                      value={evento.descripcion}
                      onChange={(e) => handleTextareaChange(index, e)}
                      placeholder="Descripción"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td
                    className={`border border-gray-300 p-1 ${
                      validationErrors[index]?.días
                        ? "outline outline-red-500"
                        : ""
                    }`}
                  >
                    <div className="flex space-x-2">
                      {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={evento.días.includes(day)}
                            onChange={() => handleDayChange(index, day)}
                            className="mr-1"
                          />
                          {day}
                        </label>
                      ))}
                    </div>
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
          Guardar Eventos
        </button>
        <button
          onClick={handleClose}
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
              (errors) => errors.tipo
            ) && <li>Tipo: Campo obligatorio</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.id_programa
            ) && <li>Programa: Seleccione un programa válido</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.fecha_inicio
            ) && <li>Fecha de Inicio: Campo obligatorio</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.hora_inicio
            ) && <li>Hora de Inicio: Campo obligatorio</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.fecha_fin
            ) && <li>Fecha de Fin: Campo obligatorio</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.hora_fin
            ) && <li>Hora de Fin: Campo obligatorio</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.días
            ) && <li>Días: Seleccione al menos un día</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddEventoManual;