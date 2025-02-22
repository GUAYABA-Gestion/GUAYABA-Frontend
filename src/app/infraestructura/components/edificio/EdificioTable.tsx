"use client";
import { Edificio } from "../../../../types/api";

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
}

const EdificioTable = ({
  edificios,
  filters,
  onEdificioClick,
  currentPage,
  itemsPerPage,
  onPageChange,
  rolSimulado,
}: EdificioTableProps) => {
  const filteredEdificios = edificios.filter((edificio) => {
    return (
      (filters.nombre === "" ||
        edificio.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
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
      {/* Tabla */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Nombre</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">Dirección</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[200px]">Categoría</th>
                <th className="border border-gray-300 px-4 py-2 min-w-[250px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEdificios.length > 0 ? (
                paginatedEdificios.map((edificio, index) => (
                  <tr
                    key={edificio.id_edificio}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
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
                        {(rolSimulado === "admin" || rolSimulado === "coord") && (
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