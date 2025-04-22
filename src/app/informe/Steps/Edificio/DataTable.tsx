import React, { useState } from "react";

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  return (
    <div>
      {data.length === 0 ? (
        // Mostrar mensaje cuando no hay datos
        <div className="p-4 text-center text-gray-500 bg-gray-100 rounded">
          No se encontraron resultados que cumplan con los filtros aplicados.
        </div>
      ) : (
        // Mostrar tabla si hay datos
        <table className="min-w-full border-collapse border border-gray-300 text-black bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Categoría</th>
              <th className="border border-gray-300 px-4 py-2">Propiedad</th>
              <th className="border border-gray-300 px-4 py-2">
                Cert. Uso Suelo
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Promedio Área Terreno
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Promedio Área Construida
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => setSelectedRow(row)} // Almacenar la fila seleccionada
              >
                <td className="border border-gray-300 px-4 py-2">
                  {row.categoria}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.propiedad}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.cert_uso_suelo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Number(row.promedio_area_terreno)?.toFixed(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Number(row.promedio_area_construida)?.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para mostrar detalles de los edificios */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold text-black mb-4">
              Detalles de Edificios
            </h2>
            <ul className="list-disc list-inside text-black">
              {selectedRow.nombres_sedes_edificios.map(
                (nombre: string, idx: number) => (
                  <li key={idx}>{nombre}</li>
                )
              )}
            </ul>
            <button
              onClick={() => setSelectedRow(null)} // Cerrar el modal
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
