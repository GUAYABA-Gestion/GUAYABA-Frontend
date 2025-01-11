"use client";
import { useState, useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components";

const backendLink = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface Sede {
  id_sede: number;
  nombre: string;
}

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [selectedSede, setSelectedSede] = useState<string | null>(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const updateFlashMessage = async (newMessage: string) => {
    try {
      const response = await fetch(`/api/updateflash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashMessage: newMessage,
        }),
      });

      if (response.ok) {
        console.log("Flash message actualizado.");
      } else {
        console.error("Error al actualizar el mensaje de flash.");
      }
    } catch (error) {
      console.error("Error al llamar al endpoint de actualización de mensaje:", error);
    }
  };

  useEffect(() => {
    const updateMessageIfNeeded = async () => {
      // Mostrar mensaje si existe en la sesión
      if (session?.flashMessage) {
        setMessage(session.flashMessage);
      }

      // Si la sesión contiene un user_id y rol, redirigimos
      if (session?.user?.id_usuario && session?.user?.rol) {
        await updateFlashMessage("Ya estás registrado, te ayudamos con el login automáticamente :)");
        router.push("/"); // Redirigir al home si ya existe el usuario
      }
    };

    updateMessageIfNeeded(); // Llamamos a la función asíncrona aquí
  }, [session, router]);

  const registerUser = async () => {
    if (!session || !session.user?.email || !selectedSede) {
      setMessage("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (!agreedToPolicy) {
      setMessage("Debes aceptar la política de tratamiento de datos.");
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
          correo: session.user.email,
          nombre: session.user.name,
          sede_id: selectedSede,
        }),
      });

      const data = await response.json();

      if (response.ok && data.registered) {
        signOut({ redirect: false }).then(() => {
          router.push("/login");
        });
      } else {
        const errorMessage = data.error || "Hubo un problema al registrar el usuario.";
        // Actualizamos el mensaje de flash en el backend antes de redirigir
        await updateFlashMessage(errorMessage);
        router.push("/"); // Redirigir incluso si hubo error
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      const errorMessage = "Error interno al registrar el usuario.";
      // Actualizamos el mensaje de flash en el backend antes de redirigir
      await updateFlashMessage(errorMessage);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return (
      <div>
        <Header />
        <h1>Registro</h1>
        <p>Debes iniciar sesión con Google para registrarte.</p>
        <button onClick={() => signIn("google")}>Registro con Google</button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h1>Registro</h1>
      {message && <div className="alert alert-success">{message}</div>}
      <label>
        Selecciona una sede:
        <select onChange={(e) => setSelectedSede(e.target.value)} defaultValue="">
          <option value="" disabled>
            Selecciona una sede
          </option>
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
          Confirmo que he leído y acepto la <a href="/policy">Política de tratamiento de datos de GUAYABA.</a>
        </label>
      </div>
      <button onClick={registerUser} disabled={isLoading}>
        {isLoading ? "Cargando..." : "Registrarse"}
      </button>
    </div>
  );
}
