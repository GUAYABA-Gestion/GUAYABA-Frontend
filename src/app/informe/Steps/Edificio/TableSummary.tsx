import React from "react";

interface TableSummaryProps {
  data: any[];
}

const TableSummary: React.FC<TableSummaryProps> = ({ data }) => {
  const totalAreaTerreno = data.reduce(
    (sum, row) => sum + Number(row.suma_area_terreno),
    0
  );
  const totalAreaConstruida = data.reduce(
    (sum, row) => sum + Number(row.suma_area_construida),
    0
  );

  return (
    <div className="mt-6 p-4 bg-white text-black rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Resumen de la Tabla</h2>
      <p>
        <strong>Total Área Terreno:</strong> {totalAreaTerreno}
      </p>
      <p>
        <strong>Total Área Construida:</strong> {totalAreaConstruida}
      </p>
    </div>
  );
};

export default TableSummary;