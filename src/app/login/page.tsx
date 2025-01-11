"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  // Efecto para manejar el comportamiento de la sesión
  useEffect(() => {
    // Si el usuario tiene un id_usuario, redirigimos al home sin cerrar la sesión
    if (session?.user?.id_usuario) {
      router.push("/");
    } else if (session?.user?.id_usuario === null) {
      // Si no tiene id_usuario, mostramos el mensaje de registro
      setMessage("No tenemos tu cuenta registrada. Por favor, ve a la página de registro.");
    }

    // Esto solo se ejecuta cuando el usuario no tiene cuenta
    return () => {
      if (session?.user?.id_usuario === null) {
        signOut({ redirect: false });
      }
    };
  }, [session, router]);

  const handleSignIn = async () => {
    const res = await signIn("google", { redirect: false });

    if (res?.error) {
      console.error(res.error);
      return;
    }
  };

  const handleRegisterRedirect = () => {
    if (!session?.user?.id_usuario) {
      // Si el usuario no está registrado, cerramos sesión y lo redirigimos a registro
      signOut({ redirect: false }).then(() => {
        router.push("/register");
      });
    }
  };

  return (
    <div>
      <Header />
      <h1>Inicio de sesión</h1>
      {message && <p>{message}</p>}
      <button onClick={handleSignIn}>Login with Google</button>
      <button onClick={handleRegisterRedirect}>
        ¡Regístrate aquí!
      </button>
    </div>
  );
}
