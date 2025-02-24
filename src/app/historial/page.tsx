"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { useRol } from "../../../context/RolContext";
import { Header, Footer } from "../../../components";
import AuditManager from "./components/AuditManager";
import { Log, User } from "../../types/api";
import { fetchUsers } from "../api/UserActions";

const Historial: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();
  const [logs, setHistorial] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching historial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchHistorial();
    fetchAllUsers();
  }, [rolSimulado]);

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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="p-4 text-gray-600">Cargando historial...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <AuditManager logs={logs} users={users} />
      <Footer />
    </div>
  );
};

export default Historial;