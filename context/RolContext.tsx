"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Si usas App Router

const RolContext = createContext<{
  rolSimulado: string | "none";
  idSede: number | null;
  cambiarRol: (nuevoRol: string | "none") => void;
  cambiarSede: (nuevoIdSede: number | null) => void;
  fetchUserData: () => Promise<void>;
} | null>(null);

export const RolProvider = ({ children }: { children: ReactNode }) => {
  const [rolSimulado, setRolSimulado] = useState<string | "none">("none");
  const [idSede, setIdSede] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Si usas App Router

  const handleLogout = () => {
    Cookies.remove("jwt");
    setRolSimulado("none");
    setIdSede(null);
    // Redirección con Next.js (App Router)
    router.push("/login");
    // O con window.location si no usas App Router
    // window.location.href = "/login";
  };

  const fetchUserData = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      setRolSimulado("none");
      setIdSede(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!response.ok) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setRolSimulado(data.rol);
      setIdSede(data.id_sede);
      setIsLoading(false);

    } catch (error) {
      console.error("Error:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <RolContext.Provider value={{ rolSimulado /*: 'coord' */, idSede, cambiarRol: setRolSimulado, cambiarSede: setIdSede, fetchUserData }}>
      {!isLoading && children}
    </RolContext.Provider>
  );
};

export const useRol = () => {
  const context = useContext(RolContext);
  if (!context) throw new Error("useRol debe usarse dentro de RolProvider");
  return context;
};