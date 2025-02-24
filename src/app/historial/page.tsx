"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { useRol } from "../../../context/RolContext";
import { Header, Footer } from "../../../components";
import AuditManager from "./components/AuditManager";
import { Log, User } from "../../types/api";
import { fetchUsers } from "../api/UserActions";
import { FiRefreshCw } from "react-icons/fi"; // Importar el icono de refrescar

const Historial: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();
  const [logs, setHistorial] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [nextFetchTime, setNextFetchTime] = useState<number>(300); // 5 minutes in seconds
  const [manualCooldown, setManualCooldown] = useState<number>(0); // Cooldown de 1 minuto para el botón manual
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auditoria/audit`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch historial");

      const data: Log[] = await response.json();
      data.sort((a: Log, b: Log) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
      setHistorial(data);
      setLastFetchTime(new Date());
      setNextFetchTime(300); // Reset the timer
    } catch (error: any) {
      setError(`❌ Error al cargar el historial: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error: any) {
      setError(`❌ Error al cargar los usuarios: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchHistorial();
    fetchAllUsers();

    const interval = setInterval(() => {
      setNextFetchTime((prev) => {
        if (prev <= 1) {
          fetchHistorial();
          return 300; // Reset the timer
        }
        return prev - 1;
      });

      setManualCooldown((prev) => (prev > 0 ? prev - 1 : 0)); // Reducir el cooldown manual
    }, 1000);

    return () => clearInterval(interval);
  }, [rolSimulado]);

  const handleManualFetch = () => {
    if (manualCooldown === 0) {
      fetchHistorial();
      setManualCooldown(60); // Cooldown de 1 minuto
    }
  };

  if (!rolSimulado || rolSimulado === "user" || rolSimulado === "maint" || rolSimulado === "coord") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-center mt-4">No tienes permisos para ver el historial.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#034f00]">Historial de Cambios</h1>
            <p className="text-gray-600">
              Última actualización: {lastFetchTime ? lastFetchTime.toLocaleTimeString() : "N/A"}
            </p>
            <p className="text-gray-600">
              Próxima actualización en: {Math.floor(nextFetchTime / 60)}:{(nextFetchTime % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <button
            onClick={handleManualFetch}
            disabled={manualCooldown > 0}
            className={`bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ${manualCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        <AuditManager logs={logs} users={users} />
      </div>
      <Footer />
    </div>
  );
};

export default Historial;