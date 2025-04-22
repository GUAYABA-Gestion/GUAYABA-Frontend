"use client";

import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import DataTable from "./DataTable";
import TableSummary from "./TableSummary";
import DataChart from "./DataChart";
import {
  categoriasEdificio,
  propiedadesEdificio,
  certUsoSuelo,
} from "../../../api/desplegableValues";
import { fetchMetricasEdificioAgrupadas } from "../../../api/InformeActions";

interface EdificiosManagerProps {
  onFilteredDataChange: (filteredData: any[]) => void; // Para pasar datos filtrados al siguiente paso
}

const EdificiosManager: React.FC<EdificiosManagerProps> = ({
  onFilteredDataChange,
}) => {
  const [metricas, setMetricas] = useState<any[]>([]);
  const [filteredMetricas, setFilteredMetricas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categoria: [] as string[],
    propiedad: [] as string[],
    certUsoSuelo: [] as string[],
  });
  const [numericFilters, setNumericFilters] = useState({
    promedio_area_terreno: { operator: ">", number: "" },
    promedio_area_construida: { operator: ">", number: "" },
  });
  const [viewMode, setViewMode] = useState<"table" | "chart">("table"); // Estado para alternar entre tabla y gráfica
  const [showFilteredBuildingsModal, setShowFilteredBuildingsModal] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idsSedes = [1, 2, 3, 4];
        const data = await fetchMetricasEdificioAgrupadas(idsSedes);

        const mappedData = data.map((metrica: any) => ({
          ...metrica,
          cert_uso_suelo: metrica.cert_uso_suelo
            ? "DISPONIBLE"
            : "NO DISPONIBLE",
        }));

        setMetricas(mappedData);
        setFilteredMetricas(mappedData);
      } catch (err: any) {
        setError(err.message || "Error al obtener métricas agrupadas");
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[
        filterType as keyof typeof filters
      ].includes(value)
        ? prevFilters[filterType as keyof typeof filters].filter(
            (item) => item !== value
          )
        : [...prevFilters[filterType as keyof typeof filters], value];

      return { ...prevFilters, [filterType]: updatedFilter };
    });
  };

  const handleNumericFilterChange = (
    key: string,
    val: { operator: string; number: number | string }
  ) => {
    setNumericFilters((prev) => ({ ...prev, [key]: val }));
  };

  const applyFilters = () => {
    const filtered = metricas.filter((metrica) => {
      const applyFilter = (
        value: number,
        filter: { operator: string; number: number | string }
      ) => {
        if (filter.number === "") return true;
        switch (filter.operator) {
          case ">":
            return value > Number(filter.number);
          case "<":
            return value < Number(filter.number);
          case "=":
            return value === filter.number;
          default:
            return true;
        }
      };

      return (
        (filters.categoria.length === 0 ||
          filters.categoria.includes(metrica.categoria)) &&
        (filters.propiedad.length === 0 ||
          filters.propiedad.includes(metrica.propiedad)) &&
        (filters.certUsoSuelo.length === 0 ||
          filters.certUsoSuelo.includes(metrica.cert_uso_suelo)) &&
        applyFilter(
          metrica.promedio_area_terreno,
          numericFilters.promedio_area_terreno
        ) &&
        applyFilter(
          metrica.promedio_area_construida,
          numericFilters.promedio_area_construida
        )
      );
    });

    setFilteredMetricas(filtered);

    // Extraer los IDs de los edificios filtrados y enviarlos al componente padre
    const filteredIds = filtered.flatMap((metrica) => metrica.ids_edificios);
    console.log(filteredIds); // Para depuración
    onFilteredDataChange(filteredIds); // Pasar solo los IDs al componente padre
  };
  const resetFilters = () => {
    setFilters({ categoria: [], propiedad: [], certUsoSuelo: [] });
    setNumericFilters({
      promedio_area_terreno: { operator: ">", number: "" },
      promedio_area_construida: { operator: ">", number: "" },
    });
    setFilteredMetricas(metricas);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Consulta de Edificios</h2>

      {error && <p className="text-red-500">{error}</p>}

      <Filters
        filters={filters}
        numericFilters={numericFilters}
        categoriasEdificio={categoriasEdificio}
        propiedadesEdificio={propiedadesEdificio}
        certUsoSuelo={certUsoSuelo}
        onFilterChange={handleFilterChange}
        onNumericFilterChange={handleNumericFilterChange}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
      />

      {filteredMetricas.length > 0 && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 mr-2 rounded ${
                viewMode === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Ver Tabla
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`px-4 py-2 rounded ${
                viewMode === "chart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Ver Gráfica
            </button>
            <button
              onClick={() => setShowFilteredBuildingsModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Ver Nombres de Edificios
            </button>
          </div>

          {viewMode === "table" && (
            <>
              <DataTable data={filteredMetricas} />
              <TableSummary data={filteredMetricas} />
            </>
          )}

          {viewMode === "chart" && <DataChart data={filteredMetricas} />}
        </>
      )}
      {showFilteredBuildingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edificios Filtrados</h2>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
              <table className="min-w-full border-collapse text-black bg-white">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Nombre del Edificio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetricas.flatMap((row, rowIdx) =>
                    row.nombres_sedes_edificios.map(
                      (nombre: string, idx: number) => (
                        <tr
                          key={`${row.categoria}-${rowIdx}-${idx}`}
                          className="even:bg-gray-50"
                        >
                          <td className="border border-gray-300 px-4 py-2">
                            {nombre}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  const nombres = filteredMetricas
                    .flatMap((row) => row.nombres_sedes_edificios)
                    .join("\n");
                  navigator.clipboard.writeText(nombres);
                  alert("Nombres copiados al portapapeles");
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Copiar Nombres
              </button>
              <button
                onClick={() => setShowFilteredBuildingsModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdificiosManager;
