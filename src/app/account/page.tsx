"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components";
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
  const [sedeData, setSedeData] = useState<Sede | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

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
        if (data.id_sede) {
          fetchSedeData(data.id_sede);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSedeData = async (sedeId: number) => {
      try {
        const jwt = Cookies.get("jwt");
        if (!jwt) throw new Error("No hay sesión activa");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/${sedeId}`,
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

  const handleRoleChange = async (newRole: string) => {
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
            rol: newRole,
            id_sede: userData.id_sede,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el rol");

      setSelectedRole(newRole);
      setMessage("✅ Rol actualizado correctamente.");
      setTimeout(() => {
        window.location.reload(); // 🔄 Recargar datos después del delay
      }, 1500); // 1
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ No se pudo actualizar el rol.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-gray-500">Rol</p>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
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
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Información de la Sede
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Sede Asignada</p>
                <p className="font-medium text-gray-800">
                  {sedeData?.nombre || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Sede</p>
                <p className="font-medium text-gray-800">
                  {userData?.id_sede || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
