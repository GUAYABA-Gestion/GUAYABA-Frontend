"use client";
import { Espacio } from "../../../../types/api";

interface EspacioTableProps {
  espacios: Espacio[];
  filters: {
    nombre: string;
    estado: string;
    tipo: string;
    clasificacion: string;
  };
  onEspacioClick: (espacio: Espacio) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const EspacioTable = ({
  espacios,
  filters,
  onEspacioClick,
  currentPage,
  itemsPerPage,
  onPageChange,
}: EspacioTableProps) => {
  const filteredEspacios = espacios.filter((espacio) => {
    return (
      (filters.nombre === "" || espacio.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
      (filters.estado === "" || espacio.estado === filters.estado) &&
      (filters.tipo === "" || espacio.tipo === filters.tipo) &&
      (filters.clasificacion === "" || espacio.clasificacion === filters.clasificacion)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEspacios = filteredEspacios.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredEspacios.length / itemsPerPage);

  return (
    <div className="p-4 bg-gray-50">
      {/* Tabla */}
      <div className="mt-4">
        <table className="w-full border-collapse border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-[#80BA7F] text-white">
              <th className="border border-gray-300 p-2 w-1/4">Nombre</th>
              <th className="border border-gray-300 p-2 w-1/4">Estado</th>
              <th className="border border-gray-300 p-2 w-1/4">Tipo</th>
              <th className="border border-gray-300 p-2 w-1/4">Clasificación</th>
              <th className="border border-gray-300 p-2 w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEspacios.length > 0 ? (
              paginatedEspacios.map((espacio, index) => (
                <tr
                  key={espacio.id_espacio}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="border border-gray-300 p-2 text-black">
                    {espacio.nombre}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {espacio.estado}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {espacio.tipo}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {espacio.clasificacion}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => onEspacioClick(espacio)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-gray-300 p-2 text-center text-gray-600">
                  No hay edificios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EspacioTable;
