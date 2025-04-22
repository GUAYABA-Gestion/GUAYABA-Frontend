"use client";

import React, { useState } from "react";
import EdificioStep from "./Steps/Edificio/EdificioStep";

const InformePage: React.FC = () => {
  const [filteredEdificios, setFilteredEdificios] = useState<number[]>([]); // Cambiar a un array de números

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Informe de Métricas</h1>

      <EdificioStep
        onFilteredDataChange={(ids) => setFilteredEdificios(ids)} // Recibir los IDs
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold">Consulta de Espacios</h2>
        <p className="text-gray-300 mb-2">IDs de edificios filtrados:</p>
        {filteredEdificios.length > 0 ? (
          <pre className="text-gray-300 bg-gray-800 p-2 rounded">
            {JSON.stringify(filteredEdificios, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-300">No hay edificios filtrados.</p>
        )}
      </div>
    </div>
  );
};

export default InformePage;
