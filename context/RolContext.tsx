"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Si usas App Router

const RolContext = createContext<{
  rolSimulado: string | "none";
  idSede: number | null;
  cambiarRol: (nuevoRol: string | "none") => void;
  cambiarSede: (nuevoIdSede: number | null) => void;
  fetchUserData: () => Promise<void>;
  verifyJwt: () => Promise<boolean>;
} | null>(null);

export const RolProvider = ({ children }: { children: ReactNode }) => {
  const [rolSimulado, setRolSimulado] = useState<string | "none">("none");
  const [idSede, setIdSede] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Si usas App Router
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogout = () => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      Cookies.remove("jwt");
      setRolSimulado("none");
      setIdSede(null);
      // Redirección con Next.js (App Router)
      const callbackUrl = `${pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      router.push(`/login?redirect=RolContext&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      // O con window.location si no usas App Router
      // window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (!response.ok) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setRolSimulado(data.rol);
      setIdSede(data.id_sede);
      setIsLoading(false);
    } catch (error) {
      handleLogout();
    }
  };

  const verifyJwt = async (): Promise<boolean> => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      handleLogout();
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (!response.ok) {
        handleLogout();
        return false;
      }

      return true;
    } catch (error) {
      handleLogout();
      return false;
    }
  };

  const verifyJwtPeriodically = () => {
    const interval = setInterval(async () => {
      const isValid = await verifyJwt();
      if (!isValid) {
        clearInterval(interval);
      }
    }, 300000); // Verificar cada 5 minutos (300000 ms)
  };

  useEffect(() => {
    // No verificar JWT si estamos en la página de login o registro
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      setIsLoading(false);
      return;
    }

    fetchUserData();
    verifyJwtPeriodically();
  }, [pathname]);

  return (
    <RolContext.Provider
      value={{
        rolSimulado,
        idSede,
        cambiarRol: setRolSimulado,
        cambiarSede: setIdSede,
        fetchUserData,
        verifyJwt,
      }}
    >
      {!isLoading && children}
    </RolContext.Provider>
  );
};

export const useRol = () => {
  const context = useContext(RolContext);
  if (!context) throw new Error("useRol debe usarse dentro de RolProvider");
  return context;
};