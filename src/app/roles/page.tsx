"use client";
import { useEffect, useState } from "react";
import { useRol } from "../../../context/RolContext";
import { Header, Footer } from "../../../components";
import UserManager from "./components/UserManager";
import { User, Sede } from "../../types/api";
import { fetchUsers, fetchSedes } from "../api/UserActions";

const AdminDashboard = () => {
  const { rolSimulado } = useRol();
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers();
        usersData.sort((a: User, b: User) => a.id_persona - b.id_persona);
        setUsers(usersData);
        const sedesData = await fetchSedes();
        sedesData.sort((a: Sede, b: Sede) => a.id_sede - b.id_sede);
        setSedes(sedesData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <UserManager users={users} sedes={sedes} onUsersUpdated={setUsers} />
      <Footer />
    </div>
  );
};

export default AdminDashboard;
