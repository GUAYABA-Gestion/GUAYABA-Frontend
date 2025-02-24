"use client";
import { Edificio, Sede } from "../../../../types/api";
import ExcelExportButton from "./ExcelExportButton";

interface EdificioTableProps {
  edificios: Edificio[];
  filters: {
    nombre: string;
    categoria: string;
  };
  onEdificioClick: (edificio: Edificio) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  rolSimulado: string; // Añadir el rol simulado
  sedes: Sede[];
  onAddEdificioClick: () => void;
  onFilterChange: (filter: string, value: string) => void;
  onResetFilters: () => void;
  uniqueCategorias: string[];
  selectedSedes: number[]; // Recibimos selectedSedes como prop
  onGenerateInformeClick: () => void; // Añadir prop para manejar el click del botón de generar informe
}

const EdificioTable: React.FC<EdificioTableProps> = ({
  edificios,
  filters,
  onEdificioClick,
  currentPage,
  itemsPerPage,
  onPageChange,
  rolSimulado,
  sedes,
  onAddEdificioClick,
  onFilterChange,
  onResetFilters,
  uniqueCategorias,
  selectedSedes,
  onGenerateInformeClick, // Añadir prop para manejar el click del botón de generar informe
}) => {
  const filteredEdificios = edificios
    .filter((edificio) => selectedSedes.includes(edificio.id_sede))
    .filter((edificio) => {
      return (
        (filters.nombre === "" ||
          edificio.nombre
            .toLowerCase()
            .includes(filters.nombre.toLowerCase())) &&
        (filters.categoria === "" || edificio.categoría === filters.categoria)
      );
    });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEdificios = filteredEdificios.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredEdificios.length / itemsPerPage);

  return (
    <div className="p-4 bg-gray-50">
      {/* Filtros y botón de Añadir Edificios */}
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filters.nombre}
            onChange={(e) => onFilterChange("nombre", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          />
          <select
            value={filters.categoria}
            onChange={(e) => onFilterChange("categoria", e.target.value)}
            className="p-2 border rounded text-black text-sm w-full md:w-auto"
          >
            <option value="">Filtrar por categoría</option>
            {uniqueCategorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <button
            onClick={onResetFilters}
            className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 text-sm w-full md:w-auto"
          >
            Reiniciar Filtros
          </button>
          {(rolSimulado === "admin" || rolSimulado === "coord") && (
            <button
              onClick={onAddEdificioClick}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300 text-sm w-full md:w-auto"
            >
              + Añadir Edificios
            </button>
          )}
          {(rolSimulado !== "user") && (
            <>
              <ExcelExportButton
                edificios={filteredEdificios}
                sedes={sedes}
                filters={filters}
              />
              <button
                onClick={onGenerateInformeClick} // Llamar a la función pasada por prop
                className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300 text-sm w-full md:w-auto"
              >
                Generar Informe
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                  Nombre
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">
                  Dirección
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">
                  Categoría
                </th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEdificios.length > 0 ? (
                paginatedEdificios.map((edificio, index) => (
                  <tr
                    key={edificio.id_edificio}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {edificio.nombre}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {edificio.dirección}
                    </td>
                    <td className="border border-gray-300 p-2 text-black text-sm">
                      {edificio.categoría}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        {(rolSimulado === "admin" ||
                          rolSimulado === "coord") && (
                          <button
                            onClick={() => onEdificioClick(edificio)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Ver Detalles
                          </button>
                        )}
                        <button
                          onClick={() =>
                            (window.location.href = `/espacios?idEdificio=${edificio.id_edificio}`)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        >
                          Ver Espacios
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-300 p-2 text-center text-gray-600 text-sm"
                  >
                    No hay edificios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded text-sm ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EdificioTable;