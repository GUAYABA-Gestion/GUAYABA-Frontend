"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Si usas App Router

const RolContext = createContext<{
  rolSimulado: string | "none";
  cambiarRol: (nuevoRol: string | "none") => void;
  fetchUserData: () => Promise<void>;
} | null>(null);

export const RolProvider = ({ children }: { children: ReactNode }) => {
  const [rolSimulado, setRolSimulado] = useState<string | "none">("none");
  const router = useRouter(); // Si usas App Router

  const handleLogout = () => {
    Cookies.remove("jwt");
    setRolSimulado("none");
    // Redirección con Next.js (App Router)
    router.push("/login");
    // O con window.location si no usas App Router
    // window.location.href = "/login";
  };

  const fetchUserData = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      setRolSimulado("none");
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
      
    } catch (error) {
      console.error("Error:", error);
      handleLogout();
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

export const useRol = () => {
  const context = useContext(RolContext);
  if (!context) throw new Error("useRol debe usarse dentro de RolProvider");
  return context;
};