"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Footer, Header } from "../../../components";
import { User, Sede } from "../../types/api";
import Cookies from "js-cookie";

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "coord", label: "Coordinador" },
  { value: "maint", label: "Mantenimiento" },
  { value: "user", label: "Usuario" },
];

export default function Account() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [sedeData, setSedeData] = useState<Sede[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener datos del usuario");

        const data = await response.json();
        setUserData(data);
        setSelectedRole(data.rol);
        setSelectedSede(data.id_sede);
        if (data.id_sede) {
          fetchSedeData();
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSedeData = async () => {
      try {
        const jwt = Cookies.get("jwt");
        if (!jwt) throw new Error("No hay sesión activa");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/sedes`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Sede no encontrada"
              : "Error al obtener datos de la sede"
          );
        }

        setSedeData(await response.json());
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (session?.googleToken || Cookies.get("jwt")) {
      fetchUserData();
    } else {
      router.push("/login");
    }
  }, [session, router]);

  const handleSaveChanges = async () => {
    if (!userData) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          body: JSON.stringify({
            id_persona: userData.id_persona,
            nombre: userData.nombre,
            correo: userData.correo,
            rol: selectedRole,
            id_sede: selectedSede,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar los datos");

      setMessage("✅ Datos actualizados correctamente.");
      setEditMode(false);
      setTimeout(() => {
        setMessage(null);
        window.location.reload(); // Forzar un refresh para actualizar el header
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ No se pudo actualizar los datos.");
    }
  };

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
      <main className="flex-grow max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow mb-8 min-w-[48rem]">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Cuenta</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.startsWith("❌")
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Información Personal
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium text-gray-800">
                  {userData?.nombre || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correo</p>
                <p className="font-medium text-gray-800">
                  {userData?.correo || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol Simulado</p>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={!editMode}
                >
                  {roleOptions.map((role) => (
                    <option
                      key={role.value}
                      value={role.value}
                      className="text-black"
                    >
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sede Simulada</p>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                  disabled={!editMode}
                >
                  <option value="" disabled className="text-black">
                    Seleccione una sede
                  </option>
                  {sedeData.map((sede) => (
                    <option
                      key={sede.id_sede}
                      value={sede.id_sede}
                      className="text-black"
                    >
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex justify-center">
          {editMode ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mx-2"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Editar
            </button>
          )}
        </div>

        {editMode && (
          <div className=" rounded-lg bg-yellow-100 text-yellow-800">
            ⚠️ Recuerda que puedes probar y experimentar con las funcionalidades del rol que selecciones. Confiamos en que no vas a eliminar toda la base de datos. :) 
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}