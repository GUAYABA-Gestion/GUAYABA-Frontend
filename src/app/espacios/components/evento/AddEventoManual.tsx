"use client";
import { useState } from "react";
import { addEventosManual } from "../../../api/EventoActions";
import { Evento, Programa } from "../../../../types/api";
import { tiposEvento } from "../../../api/desplegableValues";

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
      hora_inicio: boolean;
      fecha_fin: boolean;
      hora_fin: boolean;
    }>
  >([]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const updatedEventos = [...eventos];
    updatedEventos[index] = {
      ...updatedEventos[index],
      [e.target.name]: e.target.value,
    };

    setEventos(updatedEventos);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [e.target.name]: false,
    };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setEventos([
      ...eventos,
      {
        id_evento: 0,
        id_espacio: idEspacio,
        nombre: "",
        tipo: "",
        id_programa: 0,
        fecha_inicio: "",
        hora_inicio: "",
        fecha_fin: "",
        hora_fin: "",
        descripcion: "",
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
        hora_inicio: false,
        fecha_fin: false,
        hora_fin: false,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedEventos = eventos.filter((_, i) => i !== index);
    setEventos(updatedEventos);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleModalClose = () => {
    setEventos([]);
    setValidationErrors([]);
    setError(null);
    onClose();
  }

  const handleSubmit = async () => {
    if (eventos.length === 0) {
      setError("No hay eventos para añadir.");
      return;
    }

    const newValidationErrors = eventos.map((evento) => ({
      nombre: !evento.nombre,
      tipo: !evento.tipo,
      id_programa: !evento.id_programa,
      fecha_inicio: !evento.fecha_inicio,
      hora_inicio: !evento.hora_inicio,
      fecha_fin: !evento.fecha_fin,
      hora_fin: !evento.hora_fin,
    }));

    setValidationErrors(newValidationErrors);

    const hasErrors = newValidationErrors.some(
      (error) =>
        error.nombre ||
        error.tipo ||
        error.id_programa ||
        error.fecha_inicio ||
        error.hora_inicio ||
        error.fecha_fin ||
        error.hora_fin
    );

    if (hasErrors) {
      setError("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      const formattedEventos = eventos.map((evento) => ({
        ...evento,
        fecha_inicio: evento.fecha_inicio,
        fecha_fin: evento.fecha_fin,
      }));

      const response = await addEventosManual(formattedEventos);
      onEventosAdded(response);
      setEventos([]);
      setValidationErrors([]);
      onClose();
    } catch (error: any) {
      setError(`Error al añadir eventos: ${error.message}`);
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
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Tipo
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Programa
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Fecha Inicio
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Hora Inicio
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Fecha Fin
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[150px]">
                  Hora Fin
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                  Descripción
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[100px]">
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
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.nombre ? "outline outline-red-500" : ""}`}>
                    <input
                      type="text"
                      name="nombre"
                      value={evento.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.tipo ? "outline outline-red-500" : ""}`}>
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
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.id_programa ? "outline outline-red-500" : ""}`}>
                    <select
                      name="id_programa"
                      value={evento.id_programa}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    >
                      <option value={0}>Seleccione un programa</option>
                      {programas.map((programa) => (
                        <option key={programa.id_programa} value={programa.id_programa}>
                          {programa.programa_nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.fecha_inicio ? "outline outline-red-500" : ""}`}>
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={evento.fecha_inicio}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.hora_inicio ? "outline outline-red-500" : ""}`}>
                    <input
                      type="time"
                      name="hora_inicio"
                      value={evento.hora_inicio}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.fecha_fin ? "outline outline-red-500" : ""}`}>
                    <input
                      type="date"
                      name="fecha_fin"
                      value={evento.fecha_fin}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className={`border border-gray-300 p-1 ${validationErrors[index]?.hora_fin ? "outline outline-red-500" : ""}`}>
                    <input
                      type="time"
                      name="hora_fin"
                      value={evento.hora_fin}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <textarea
                      name="descripcion"
                      value={evento.descripcion}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Descripción"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      name="días"
                      value={evento.días}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Días"
                      className="w-full px-2 py-1 text-sm text-black"
                    />
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
          Guardar Eventos
        </button>
        <button
          onClick={handleModalClose}
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
            ) && <li>Tipo: Seleccione un tipo válido</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.id_programa
            ) && <li>Programa: Seleccione un programa válido</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.fecha_inicio
            ) && <li>Fecha Inicio: Ingrese una fecha válida</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.hora_inicio
            ) && <li>Hora Inicio: Ingrese una hora válida</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.fecha_fin
            ) && <li>Fecha Fin: Ingrese una fecha válida</li>}
            {Object.values(validationErrors).some(
              (errors) => errors.hora_fin
            ) && <li>Hora Fin: Ingrese una hora válida</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddEventoManual;