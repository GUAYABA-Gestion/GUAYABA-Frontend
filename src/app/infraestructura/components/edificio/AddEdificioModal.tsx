"use client";
import { useState } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { addEdificiosManual } from "../../../api/auth/EdificioActions";
import { Edificio, Sede } from "../../../../types/api";
import { validateTextNotNull, validatePositiveNumber, validateCorreo } from "../../../api/auth/validation";

interface AddEdificioModalProps {
  isOpen: boolean;
  onClose: () => void;
  sedes: Sede[];
  onEdificiosAdded: (newEdificios: Edificio[]) => void;
  showSuccessMessage: () => void;
}

const AddEdificioModal: React.FC<AddEdificioModalProps> = ({ isOpen, onClose, sedes, onEdificiosAdded, showSuccessMessage }) => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
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
  const [showCsvInfo, setShowCsvInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedEdificios: Edificio[] = result.data.map((row: any) => ({
          nombre: row.nombre || "",
          dirección: row.dirección || "",
          id_sede: Number(row.id_sede) || 0,
          categoría: row.categoría || "",
          propiedad: row.propiedad || "",
          area_terreno: Number(row.area_terreno) || 0,
          area_construida: Number(row.area_construida) || 0,
          cert_uso_suelo: row.cert_uso_suelo === "DISPONIBLE",
          id_edificio: 0,
          id_titular: 0,
          correo_titular: row.correo_titular || "",
          nombre_sede: "",
          nombre_titular: ""
        }));

        setEdificios([...edificios, ...parsedEdificios]);
        setValidationErrors([...validationErrors, ...parsedEdificios.map(() => ({ nombre: false, dirección: false, id_sede: false, area_terreno: false, area_construida: false, correo_titular: false }))]);
      },
      error: (err) => console.error("Error al leer CSV:", err.message),
    });
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
      correo_titular: !validateCorreo(edificio.correo_titular),
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
    setShowCsvInfo(false);
    setSelectedFile(null);
    onClose();
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plantilla Edificios");

    worksheet.columns = [
      { header: "nombre", key: "nombre", width: 20 },
      { header: "dirección", key: "dirección", width: 30 },
      { header: "id_sede", key: "id_sede", width: 10 },
      { header: "categoría", key: "categoría", width: 15 },
      { header: "propiedad", key: "propiedad", width: 15 },
      { header: "area_terreno", key: "area_terreno", width: 15 },
      { header: "area_construida", key: "area_construida", width: 15 },
      { header: "cert_uso_suelo", key: "cert_uso_suelo", width: 15 },
      { header: "correo_titular", key: "correo_titular", width: 25 },
    ];

    worksheet.addRow(["", "", 0, "", "", 0, 0, "NO DISPONIBLE", ""]);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edificio_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedSedes = [...sedes].sort((a, b) => a.id_sede - b.id_sede);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${isOpen ? "visible" : "invisible"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Añadir Edificios</h2>

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
                    <input
                      type="text"
                      name="categoría"
                      value={edificio.categoría}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Categoría"
                      className="input text-black w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      name="propiedad"
                      value={edificio.propiedad}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Propiedad"
                      className="input text-black w-full"
                    />
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
                  <td className={`border border-gray-300 p-2 ${validationErrors[index]?.correo_titular ? "outline outline-red-500" : ""}`}>
                    <input
                      type="text"
                      name="correo_titular"
                      value={edificio.correo_titular}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Correo Titular"
                      className="input text-black w-full"
                    />
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

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showCsvInfo}
              onChange={() => setShowCsvInfo(!showCsvInfo)}
              className="mr-2"
            />
            <span className="text-black">Mostrar opciones de carga por CSV</span>
          </label>
        </div>

        {showCsvInfo && (
          <>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4 text-black" />

            <button onClick={handleDownloadTemplate} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
              Descargar Plantilla Excel
            </button>

            <div className="mt-4 text-black">
              <h3 className="font-bold">Instrucciones para llenar el Excel:</h3>
              <ul className="list-disc list-inside">
                <li>Nombre: Nombre del edificio</li>
                <li>Dirección: Dirección del edificio</li>
                <li>Sede: ID de la sede. Los IDs de las sedes disponibles son:</li>
                <ul className="list-disc list-inside ml-4">
                  {sortedSedes.map((sede) => (
                    <li key={sede.id_sede}>{sede.id_sede}: {sede.nombre}</li>
                  ))}
                </ul>
                <li>Categoría: Categoría del edificio</li>
                <li>Propiedad: Propiedad del edificio</li>
                <li>Área Terreno: Área del terreno del edificio</li>
                <li>Área Construida: Área construida del edificio</li>
                <li>Cert. Uso Suelo: Puede ser "DISPONIBLE" o "NO DISPONIBLE"</li>
                <li>Correo Titular: Correo del titular del edificio</li>
              </ul>
              <p><b>Por favor, guarde el archivo como CSV UTF-8 antes de subirlo.</b></p>
            </div>
          </>
        )}

        <div className="mt-4 flex space-x-4">
          <button onClick={handleSubmit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar Edificios</button>
          <button onClick={handleClose} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancelar</button>
        </div>

        {Object.values(validationErrors).some((errors) => Object.values(errors).some((error) => error)) && (
          <div className="mt-4 text-red-500">
            <ul>
              {Object.values(validationErrors).some((errors) => errors.nombre) && <li>Nombre: Campo requerido</li>}
              {Object.values(validationErrors).some((errors) => errors.dirección) && <li>Dirección: Campo requerido</li>}
              {Object.values(validationErrors).some((errors) => errors.id_sede) && <li>Sede: Asegúrese de seleccionar una sede válida</li>}
              {Object.values(validationErrors).some((errors) => errors.area_terreno) && <li>Área Terreno: Debe ser un número positivo</li>}
              {Object.values(validationErrors).some((errors) => errors.area_construida) && <li>Área Construida: Debe ser un número positivo</li>}
              {Object.values(validationErrors).some((errors) => errors.correo_titular) && <li>Correo Titular: Debe ser un correo válido</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEdificioModal;