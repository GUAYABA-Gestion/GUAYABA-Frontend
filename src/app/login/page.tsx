"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Importar useSearchParams
import { Header } from "../../../components";
import { setAuthCookie, getAuthCookie, removeAuthCookie } from "../../../utils/cookies";
import { setTempMessage } from "../../../utils/cookies";
import { useRol } from "../../../context/RolContext"; // Importar contexto de rol

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams(); // Obtener parámetros de la URL
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { cambiarRol, fetchUserData } = useRol(); // Usar el contexto de rol

  // Obtener el callbackUrl de los parámetros de la URL
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const jwt = getAuthCookie();

    // Si ya hay un JWT válido, redirigir al callbackUrl o al home
    if (jwt) {
      router.push(callbackUrl);
      return;
    }

    // Si hay sesión de Google pero no JWT, verificar usuario
    if (session?.googleToken) {
      const checkUser = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/check-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleToken: session.googleToken }),
          });

          const data = await response.json();

          if (data.exists) {
            setAuthCookie(data.token);
            await fetchUserData();
            router.push(callbackUrl); // Redirigir al callbackUrl después del login
          } else {
            setTempMessage("No tienes una cuenta registrada. Por favor, completa tu registro.");
            await signOut({ redirect: false });
            router.push('/register');
          }
        } catch (error) {
          console.error('Error al verificar usuario:', error);
          setMessage('❌ Error al verificar tu cuenta. Intenta de nuevo.');
        } finally {
          setIsLoading(false);
        }
      };

      checkUser();
    }
  }, [session, router, callbackUrl]); // Agregar callbackUrl como dependencia

  const handleSignIn = async () => {
    setIsLoading(true);
    const res = await signIn('google', { redirect: false });
    if (res?.error) {
      console.error(res.error);
      setMessage('❌ Error al iniciar sesión. Intenta de nuevo.');
    }
    setIsLoading(false);
  };

  const handleRegisterRedirect = async () => {
    removeAuthCookie();
    setTempMessage("Por favor, regístrate para continuar.");
    await signOut({ redirect: false });
    router.push('/register');
  };

  if (session?.googleToken && !getAuthCookie()) {
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Inicio de sesión
        </h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.startsWith("❌") 
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Iniciando sesión...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              Continuar con Google
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">¿No tienes una cuenta?</p>
          <button
            onClick={handleRegisterRedirect}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            ¡Regístrate aquí!
          </button>
        </div>
      </main>
    </div>
  );
}