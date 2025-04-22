import React from "react";
import NumericFilter from "../../../../../components/NumericFilter";

interface FiltersProps {
  filters: {
    categoria: string[];
    propiedad: string[];
    certUsoSuelo: string[];
  };
  numericFilters: {
    promedio_area_terreno: { operator: string; number: number | string };
    promedio_area_construida: { operator: string; number: number | string };
  };
  categoriasEdificio: string[];
  propiedadesEdificio: string[];
  certUsoSuelo: string[];
  onFilterChange: (filterType: string, value: string) => void;
  onNumericFilterChange: (
    key: string,
    val: { operator: string; number: number | string }
  ) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  numericFilters,
  categoriasEdificio,
  propiedadesEdificio,
  certUsoSuelo,
  onFilterChange,
  onNumericFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Filtros:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Categorías:</h3>
          {categoriasEdificio.map((categoria) => (
            <label key={categoria} className="block">
              <input
                type="checkbox"
                checked={filters.categoria.includes(categoria)}
                onChange={() => onFilterChange("categoria", categoria)}
                className="mr-2"
              />
              {categoria}
            </label>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Propiedades:</h3>
          {propiedadesEdificio.map((propiedad) => (
            <label key={propiedad} className="block">
              <input
                type="checkbox"
                checked={filters.propiedad.includes(propiedad)}
                onChange={() => onFilterChange("propiedad", propiedad)}
                className="mr-2"
              />
              {propiedad}
            </label>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Certificados de Uso de Suelo:</h3>
          {certUsoSuelo.map((cert) => (
            <label key={cert} className="block">
              <input
                type="checkbox"
                checked={filters.certUsoSuelo.includes(cert)}
                onChange={() => onFilterChange("certUsoSuelo", cert)}
                className="mr-2"
              />
              {cert}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="font-semibold mb-2">Promedio Área Terreno:</h3>
          <NumericFilter
            label=""
            value={numericFilters.promedio_area_terreno}
            onChange={(val) => onNumericFilterChange("promedio_area_terreno", val)}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Promedio Área Construida:</h3>
          <NumericFilter
            label=""
            value={numericFilters.promedio_area_construida}
            onChange={(val) =>
              onNumericFilterChange("promedio_area_construida", val)
            }
          />
        </div>
      </div>

      <button
        onClick={onApplyFilters}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Aplicar Filtros
      </button>

      <button
        onClick={onResetFilters}
        className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Reiniciar Filtros
      </button>
    </div>
  );
};

export default Filters;