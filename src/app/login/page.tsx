"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const backendLink = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function Login() {
  const { data: session } = useSession();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Leer el mensaje desde localStorage si existe
    const flashMessage = localStorage.getItem("flashMessage");
    if (flashMessage) {
      setMessage(flashMessage);
      localStorage.removeItem("flashMessage"); // Limpiar el mensaje después de mostrarlo
    }
  }, []);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`${backendLink}/api/check-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
          }

          const data = await response.json();
          setIsRegistered(data.exists);
        } catch (error) {
          console.error("Error al verificar el registro:", error);
          setIsRegistered(false); // Asumimos no registrado si hay error
        }
      }
    };

    if (session) {
      checkUserRegistration();
    }
  }, [session]);

  // Solo redirigir cuando la sesión está verificada y registrada
  useEffect(() => {
    if (session && isRegistered) {
      // Guardar mensaje de éxito en localStorage antes de redirigir
      localStorage.setItem("flashMessage", "Login exitoso. ¡Bienvenido a Guayaba!");
      router.push("/"); // Redirige al inicio si está registrado
    }
  }, [session, isRegistered, router]);

  const handleRedirectToRegister = async () => {
    try {
      await signOut({ redirect: false }); // Cierra sesión de Google sin redirigir automáticamente
      window.location.href = "/register"; // Redirige manualmente a la página de registro
    } catch (error) {
      console.error("Error al redirigir al registro:", error);
    }
  };

  if (!session) {
    return (
      <div>
        <h1>Inicio de sesión</h1>
        <button onClick={() => signIn("google")}>Login with Google</button>
        <button onClick={() => router.push("/register")}>Registrarse</button>
      </div>
    );
  }

  if (isRegistered === null) {
    return <p>Verificando estado de registro...</p>;
  }

  if (!isRegistered) {
    return (
      <div>
        <h1>¡Hola, {session.user?.name}!</h1>
        <p>No tienes cuenta registrada.</p>
        <p>
          Por favor, dirígete a la página de <a href="/register">registro</a>.
        </p>
        <button onClick={handleRedirectToRegister}>Ir a registro</button>
      </div>
    );
  }

  return (
    <div>
      {message && <div className="alert alert-success">{message}</div>}
    </div>
  );
}
