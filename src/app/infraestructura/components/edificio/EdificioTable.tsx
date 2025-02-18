"use client";
import { Edificio } from "../../../../types/api";

interface EdificioTableProps {
  edificios: Edificio[];
  filters: {
    nombre: string;
    categoria: string;
  };
  onEdificioClick: (edificio: Edificio) => void;
}

const EdificioTable = ({
  edificios,
  filters,
  onEdificioClick,
}: EdificioTableProps) => {
  const filteredEdificios = edificios.filter((edificio) => {
    return (
      (filters.nombre === "" || edificio.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
      (filters.categoria === "" || edificio.categoría === filters.categoria)
    );
  });

  return (
    <div className="p-4 bg-gray-50">
      {/* Tabla */}
      <div className="mt-4">
        <table className="w-full border-collapse border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-[#80BA7F] text-white">
              <th className="border border-gray-300 p-2 w-1/4">Nombre</th>
              <th className="border border-gray-300 p-2 w-1/4">Dirección</th>
              <th className="border border-gray-300 p-2 w-1/4">Categoría</th>
              <th className="border border-gray-300 p-2 w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEdificios.length > 0 ? (
              filteredEdificios.map((edificio, index) => (
                <tr
                  key={edificio.id_edificio}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="border border-gray-300 p-2 text-black">
                    {edificio.nombre}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {edificio.dirección}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">
                    {edificio.categoría}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => onEdificioClick(edificio)}
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
    </div>
  );
};

export default EdificioTable;
