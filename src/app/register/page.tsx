"use client";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Header } from "../../../components";
import { Sede } from "../../types/api";
import { getTempMessage, removeTempMessage } from "../../../utils/cookies";
import { useRol } from "../../../context/RolContext"; // Importar contexto de rol

const roleOptions = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
  { value: "coord", label: "Coordinador" },
  { value: "maint", label: "Mantenimiento" },
];

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [selectedSede, setSelectedSede] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("user"); // Default role is "user"
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);
  const [showRoleMessage, setShowRoleMessage] = useState(false); // Estado para mostrar el mensaje
  const [roleConfirmed, setRoleConfirmed] = useState(false); // Estado para confirmar el rol
  const { cambiarRol, fetchUserData } = useRol(); // Usar el contexto de rol

  useEffect(() => {
    const checkUserRegistration = async () => {
      try {
        const tokenToSend = session?.googleToken;
        if (!tokenToSend) {
          setIsChecking(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/check-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenToSend}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error en la verificación");

        const data = await response.json();

        if (data.exists) {
          // Manejar usuario registrado
          if (session?.googleToken && !Cookies.get("jwt")) {
            Cookies.set("jwt", data.token, {
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            });
          }
          await fetchUserData();
          await signOut({ redirect: false });
          setMessage("✅ Ya estás registrado. Redirigiendo...");
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        // Usuario no registrado, cargar sedes
        if (session?.googleToken) await loadSedes();
      } catch (error) {
        console.error("Error al verificar:", error);
      } finally {
        setIsChecking(false);
      }
    };

    const loadSedes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes`,
          {
            headers: {
              Authorization: `Bearer ${session?.googleToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al cargar sedes");
        setSedes(await response.json());
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Error al cargar las sedes disponibles");
      }
    };

    const tempMessage = getTempMessage();
    if (tempMessage) {
      setMessage(tempMessage);
      removeTempMessage();
    }

    checkUserRegistration();
  }, [session, router]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
    setShowRoleMessage(true);
    setRoleConfirmed(false); // Resetear la confirmación del rol
  };

  const handleRoleConfirmation = () => {
    setRoleConfirmed(true);
    setShowRoleMessage(false);
  };

  const handleRegistration = async () => {
    if (!session?.googleToken) {
      setMessage("❌ Error de autenticación");
      return;
    }

    // Validaciones del formulario
    const errors = [];
    if (!selectedSede) errors.push("selecciona una sede");
    if (!agreedToPolicy) errors.push("acepta las políticas");
    if (!roleConfirmed) errors.push("confirma tu rol"); // Validar la confirmación del rol

    if (errors.length > 0) {
      setMessage(`⚠️ Por favor: ${errors.join(" y ")}`);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleToken: session.googleToken,
            id_sede: selectedSede,
            rol: selectedRole, // Incluir el rol seleccionado
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Cookies.set("jwt", data.token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: 1,
        });
        await fetchUserData();
        await signOut({ redirect: false });
        router.push("/");
      } else {
        throw new Error(data.error || "Error en el registro");
      }
    } catch (error) {
      console.error("Registro fallido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-md mx-auto mt-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Registro</h1>
          <p className="mb-6 text-gray-600">
            Para continuar, inicia sesión con tu cuenta institucional
          </p>
          <button
            onClick={() => signIn("google")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            Continuar con Google
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Completa tu registro
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800"
                : message.startsWith("⚠️")
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Selecciona tu sede
          </label>
          <select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            disabled={isLoading}
          >
            <option value="" disabled className="text-black">
              Elige una sede
            </option>
            {sedes.map((sede) => (
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

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Selecciona tu rol
          </label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            disabled={isLoading}
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

        {showRoleMessage && (
          <>
          <div className="mb-2 rounded-lg bg-yellow-100 text-yellow-800 p-4">
            ⚠️ Recuerda que puedes probar y experimentar con las funcionalidades del rol que selecciones. Confiamos en que no vas a eliminar toda la base de datos. :)
          </div>
          <button
              onClick={handleRoleConfirmation}
              className="mt-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Entiendo y confirmo mi rol.
            </button>
        </>
        )}

        <div className="mb-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToPolicy}
              onChange={(e) => setAgreedToPolicy(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600">
              Acepto la{" "}
              <a
                href="/policy"
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Tratamiento de Datos
              </a>
            </span>
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleRegistration}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Registrando...
              </div>
            ) : (
              "Finalizar Registro"
            )}
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}