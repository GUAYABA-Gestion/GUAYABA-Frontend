"use client";

import { useRol } from "../context/RolContext";

const SelectorRol = () => {
  const { rolSimulado, cambiarRol } = useRol();

  const rolesDisponibles = ["admin", "coordinador", "mantenimiento", "estudiante"];

  return (
    <div className="mb-4">
      <h2>Cambiar rol simulado</h2>
      <select
        value={rolSimulado}
        onChange={(e) => cambiarRol(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        {rolesDisponibles.map((rol) => (
          <option key={rol} value={rol}>
            {rol.charAt(0).toUpperCase() + rol.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectorRol;
