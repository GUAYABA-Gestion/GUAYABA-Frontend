"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const backendLink = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface Sede {
  id_sede: number;
  nombre: string;
}

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Traer las sedes al cargar la página
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await fetch(`${backendLink}/api/sedes`);
        const data = await response.json();
        setSedes(data);
      } catch (error) {
        console.error("Error al obtener las sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  // Solo registrar al usuario si está logueado y no se ha registrado antes
  const registerUser = async (selectedSede: string) => {
    if (!session || !session.user?.email || !selectedSede) {
      console.error("Faltan datos para registrar al usuario");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${backendLink}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          nombre: session.user.name,
          sede_id: selectedSede,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.registered) {
        if (data.message === "El usuario ya está registrado.") {
          // El usuario ya está registrado, realizar login automáticamente
          localStorage.setItem("flashMessage", "Ya estás registrado, te ayudamos con el login automáticamente :)");
          router.push("/");
        } else {
          // Redirigir al home después del registro exitoso
          localStorage.setItem("flashMessage", "Cuenta creada exitosamente.");
          router.push("/");
        }
      } else {
        // Otros errores generales
        console.error("Error al registrar usuario:", data.error || data.message);
        localStorage.setItem("flashMessage", data.error || "Hubo un problema al registrar el usuario.");
        router.push("/");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      localStorage.setItem("flashMessage", "Error interno al registrar el usuario.");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el login con Google
  const handleGoogleSignIn = async () => {
    const selectedSede = localStorage.getItem("selectedSede");

    if (!selectedSede) {
      alert("Por favor, selecciona una sede.");
      return;
    }
    if (!agreedToPolicy) {
      alert("Debes aceptar la política de tratamiento de datos.");
      return;
    }

    // Iniciar sesión con Google
    signIn("google");
  };

  // Si hay sesión, intenta registrar al usuario
  useEffect(() => {
    if (session) {
      const selectedSede = localStorage.getItem("selectedSede");
      if (selectedSede) {
        registerUser(selectedSede);
      }
    }
  }, [session]);

  // Renderiza el contenido de carga o de redirección según el estado
  if (isLoading) {
    return <p>Cargando...</p>;
  }

  // Si no hay sesión, mostrar el formulario de registro
  if (!session) {
    return (
      <div>
        <h1>Registro</h1>
        <label>
          Selecciona una sede:
          <select
            onChange={(e) => localStorage.setItem("selectedSede", e.target.value)}
          >
            <option value="">Selecciona una sede</option>
            {sedes.map((sede) => (
              <option key={sede.id_sede} value={sede.id_sede.toString()}>
                {sede.nombre}
              </option>
            ))}
          </select>
        </label>
        <div>
          <input
            type="checkbox"
            id="policy"
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
          />
          <label htmlFor="policy">
            Acepto la <a href="/policy">Política de tratamiento de datos</a>.
          </label>
        </div>
        <button onClick={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? "Cargando..." : "Registrarse con Google"}
        </button>
      </div>
    );
  }

  return <p>Redirigiendo...</p>;
}
