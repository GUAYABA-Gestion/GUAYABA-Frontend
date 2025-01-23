"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Crear contexto
const RolContext = createContext<{
  rolSimulado: string;
  cambiarRol: (nuevoRol: string) => void;
} | null>(null);

// Proveedor del contexto
export const RolProvider = ({ children }: { children: ReactNode }) => {
  const [rolSimulado, setRolSimulado] = useState<string>("estudiante"); // Valor inicial

  const cambiarRol = (nuevoRol: string) => setRolSimulado(nuevoRol);

  return (
    <RolContext.Provider value={{ rolSimulado, cambiarRol }}>
      {children}
    </RolContext.Provider>
  );
};

// Hook para usar el contexto
export const useRol = () => {
  const context = useContext(RolContext);
  if (!context) throw new Error("useRol debe usarse dentro de RolProvider");
  return context;
};
