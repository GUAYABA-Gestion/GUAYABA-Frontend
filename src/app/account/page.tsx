"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Footer, Header } from "../../../components";
import { User, Sede } from "../../types/api";
import Cookies from "js-cookie";
import { fetchUser, fetchSedes, deleteUser } from "../api/UserActions"; // Importar las acciones

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
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchUser();
        setUserData(data);
        setSelectedRole(data.rol);
        setSelectedSede(data.id_sede);
        if (data.id_sede) {
          fetchSedeData();
        }
      } catch (error: any) {
        setMessage(
          `❌ Error al cargar los datos del usuario: ${error.message}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSedeData = async () => {
      try {
        const data = await fetchSedes();
        setSedeData(data);
      } catch (error: any) {
        setMessage(
          `❌ Error al cargar los datos de las sedes: ${error.message}`
        );
      }
    };

    fetchUserData();
  }, [session]);

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
    } catch (error: any) {
      setMessage(`❌ No se pudo actualizar los datos: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userData) return;

    try {
      await deleteUser();
      setConfirmDelete(false);
      setMessage("✅ Cuenta eliminada correctamente.");
      setTimeout(() => {
        Cookies.remove("jwt");
        signOut({ redirect: false });
        router.push("/");
      }, 1500);
    } catch (error: any) {
      setMessage(`❌ No se pudo eliminar la cuenta: ${error.message}`);
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
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
                {/* Botón de Eliminar Cuenta solo visible en modo edición */}
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
                >
                  Eliminar Cuenta
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
            <div className="rounded-lg bg-yellow-100 text-yellow-800 p-4">
              ⚠️ Recuerda que puedes probar y experimentar con las funcionalidades
              del rol que selecciones. Confiamos en que no vas a eliminar toda la
              base de datos. :)
            </div>
          )}

          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Confirmar Eliminación
                </h2>
                <p className="text-black">
                  ¿Está seguro de que desea eliminar su cuenta? Esta acción no se
                  puede deshacer.
                </p>

                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}