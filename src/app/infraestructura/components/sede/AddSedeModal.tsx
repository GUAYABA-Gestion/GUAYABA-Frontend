"use client";
import { useState } from "react";
import { Sede, Municipio, User } from "../../../../types/api";
import { validateTextNotNull } from "../../../api/validation";
import { addSedesManual } from "../../../api/SedeActions";

interface AddSedeModalProps {
  isOpen: boolean;
  onClose: () => void;
  municipios: Municipio[];
  coordinadores: User[];
  onSedesAdded: (newSedes: Sede[]) => void;
}

const AddSedeModal: React.FC<AddSedeModalProps> = ({
  isOpen,
  onClose,
  municipios,
  coordinadores,
  onSedesAdded,
}) => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ nombre: boolean; municipio: boolean }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedSedes = [...sedes];
    updatedSedes[index] = { ...updatedSedes[index], [name]: value };
    setSedes(updatedSedes);

    const updatedErrors = [...validationErrors];
    updatedErrors[index] = { ...updatedErrors[index], [name]: false };
    setValidationErrors(updatedErrors);
  };

  const handleAddRow = () => {
    setSedes([...sedes, { id_sede: 0, nombre: "", municipio: 0, coordinador: null, nombre_municipio: "", nombre_coordinador: null }]);
    setValidationErrors([...validationErrors, { nombre: false, municipio: false }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedSedes = sedes.filter((_, i) => i !== index);
    setSedes(updatedSedes);

    const updatedErrors = validationErrors.filter((_, i) => i !== index);
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    const errors = sedes.map((sede) => ({
      nombre: !validateTextNotNull(sede.nombre),
      municipio: !sede.municipio,
    }));

    setValidationErrors(errors);

    if (errors.some((error) => error.nombre || error.municipio)) {
      setError("Por favor corrija los errores antes de enviar.");
      return;
    }

    try {
      const response = await addSedesManual(sedes);
      onSedesAdded(response.sedes);
      setSedes([]);
      setValidationErrors([]);
      setError(null);
      onClose();
    } catch (error: any) {
      setError(`Error al añadir sedes: ${error.message}`);
    }
  };

  const handleClose = () => {
    setSedes([]);
    setValidationErrors([]);
    setError(null);
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${isOpen ? "visible" : "invisible"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Sedes</h2>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div className="overflow-y-auto max-h-60">
          <table className="w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Municipio</th>
                <th className="border border-gray-300 p-2">Coordinador</th>
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sedes.map((sede, index) => (
                <tr key={index}>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.nombre ? "outline outline-red-500" : ""}`}>
                    <input
                      type="text"
                      name="nombre"
                      value={sede.nombre}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Nombre"
                      className="input text-black w-full"
                    />
                  </td>
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.municipio ? "outline outline-red-500" : ""}`}>
                    <select
                      name="municipio"
                      value={sede.municipio}
                      onChange={(e) => handleInputChange(index, e)}
                      className="input text-black w-full"
                    >
                      <option value="">Seleccione un municipio</option>
                      {municipios.map((municipio) => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      name="coordinador"
                      value={sede.coordinador || ""}
                      onChange={(e) => handleInputChange(index, e)}
                      className="input text-black w-full"
                    >
                      <option value="">Seleccione un coordinador</option>
                      {coordinadores.map((coordinador) => (
                        <option key={coordinador.id_persona} value={coordinador.id_persona}>
                          {coordinador.correo}
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
        </div>

        <button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          + Añadir Fila
        </button>

        <div className="mt-4 flex space-x-4">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar Sedes</button>
          <button onClick={handleClose} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancelar</button>
        </div>

        {Object.values(validationErrors).some((errors) => Object.values(errors).some((error) => error)) && (
          <div className="mt-4 text-red-500 text-sm">
            <ul className="list-disc pl-5">
              {Object.values(validationErrors).some((errors) => errors.nombre) && <li>Nombre: Campo obligatorio</li>}
              {Object.values(validationErrors).some((errors) => errors.municipio) && <li>Municipio: Seleccione un municipio válido</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSedeModal;