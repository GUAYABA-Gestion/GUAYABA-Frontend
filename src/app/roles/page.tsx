"use client";
import { useEffect, useState } from "react";
import { useRol } from "../../../context/RolContext";
import { Header, Footer } from "../../../components";
import UserManager from "./components/UserManager";
import { User, Sede } from "../../types/api";
import { fetchUsers, fetchSedes } from "../api/UserActions";
import { FiRefreshCw } from "react-icons/fi"; // Importar el icono de refrescar

const AdminDashboard = () => {
  const { rolSimulado } = useRol();
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [nextFetchTime, setNextFetchTime] = useState<number>(300); // 5 minutes in seconds
  const [manualCooldown, setManualCooldown] = useState<number>(0); // Cooldown de 1 minuto para el botón manual

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const usersData = await fetchUsers();
      usersData.sort((a: User, b: User) => a.id_persona - b.id_persona);
      setUsers(usersData);
      const sedesData = await fetchSedes();
      sedesData.sort((a: Sede, b: Sede) => a.id_sede - b.id_sede);
      setSedes(sedesData);
      setLastFetchTime(new Date());
      setNextFetchTime(300); // Reset the timer
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      setNextFetchTime((prev) => {
        if (prev <= 1) {
          fetchData();
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
      fetchData();
      setManualCooldown(60); // Cooldown de 1 minuto
    }
  };

  if (rolSimulado !== "admin") {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-black">
              Acceso Restringido
            </h2>
            <p className="text-gray-600">
              Esta vista solo está disponible para administradores.
            </p>
          </div>
        </div>
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#034f00]">Gestión de Roles</h1>
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
        <UserManager users={users} sedes={sedes} onUsersUpdated={setUsers} />
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;