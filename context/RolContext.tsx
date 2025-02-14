"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

// Crear contexto
const RolContext = createContext<{
  rolSimulado: string | "none";
  cambiarRol: (nuevoRol: string | "none") => void;
  fetchUserData: () => Promise<void>;
} | null>(null);

// Proveedor del contexto
export const RolProvider = ({ children }: { children: ReactNode }) => {
  const [rolSimulado, setRolSimulado] = useState<string | "none">("none");

  const fetchUserData = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) return setRolSimulado("none"); // Si no hay JWT, reinicia el rol

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!response.ok) throw new Error("Error al obtener datos del usuario");

      const data = await response.json();
      setRolSimulado(data.rol);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <RolContext.Provider value={{ rolSimulado, cambiarRol: setRolSimulado, fetchUserData }}>
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
