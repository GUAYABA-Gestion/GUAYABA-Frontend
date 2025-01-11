"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components";

interface AccountInfo {
  id_usuario: number;
  usuario_correo: string;
  rol: string;
  id_persona: number;
  nombre: string;
  persona_correo: string;
  telefono: string | null;
  detalles: string | null;
}

export default function Account() {
  const { data: session, status } = useSession();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const fetchAccountInfo = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account?id_usuario=${session?.user?.id_usuario}`
          );
          if (!response.ok) throw new Error("Error al obtener la información.");
          const data = await response.json();
          setAccountInfo(data);
        } catch (error) {
          console.error("Error al cargar la información de la cuenta:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAccountInfo();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session]);

  
const handleDeleteAccount = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_usuario: session?.user?.id_usuario }),
        }
      );
      if (!response.ok) throw new Error("Error al eliminar la cuenta.");
  
      alert("Cuenta eliminada exitosamente.");
  
      // Cerrar sesión con next-auth
      signOut();
  
      // Redirigir a la página de inicio
      router.push("/");
  
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert("Hubo un problema al eliminar la cuenta.");
    }
  };

  if (isLoading) {
    return <p>Cargando información...</p>;
  }

  if (status === "unauthenticated") {
    return <p>No tienes acceso a esta página.</p>;
  }

  if (!accountInfo) {
    return <p>No se encontró información de la cuenta.</p>;
  }

  return (
    <div>
      <Header />
      <div className="mt-8">
        <h2 className="text-xl font-bold">Información de la Cuenta</h2>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Usuario</h3>
          <p><strong>ID Usuario:</strong> {accountInfo.id_usuario}</p>
          <p><strong>Correo:</strong> {accountInfo.usuario_correo}</p>
          <p><strong>Rol:</strong> {accountInfo.rol}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Persona</h3>
          <p><strong>ID Persona:</strong> {accountInfo.id_persona}</p>
          <p><strong>Nombre:</strong> {accountInfo.nombre}</p>
          <p><strong>Correo:</strong> {accountInfo.persona_correo || "N/A"}</p>
          <p><strong>Teléfono:</strong> {accountInfo.telefono || "N/A"}</p>
          <p><strong>Detalles:</strong> {accountInfo.detalles || "N/A"}</p>
        </div>
        <button
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={handleDeleteAccount}
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
}
