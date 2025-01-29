"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "../../../components";

interface Persona {
  id_persona: number;
  id_sede: number | null;
  rol: string;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  detalles: string | null;
}

export default function Home() {
  const { data: session } = useSession(); // Accede a la sesión
  const [message, setMessage] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]); // Estado para las personas
  const [isLoadingUsers, setIsLoadingUsers] = useState(true); // Estado de carga de usuarios
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(true); // Estado de carga de personas

  useEffect(() => {
    if (session?.flashMessage) {
      // Si existe el flashMessage en la sesión, lo mostramos
      setMessage(session.flashMessage);
    }
  }, [session]); // Dependencia de sesión para que se actualice cuando cambie

  useEffect(() => {

    const fetchPersonas = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/personas`
        );
        if (!response.ok) throw new Error("Error al obtener personas.");
        setPersonas(await response.json());
      } catch (error) {
        console.error("Error al cargar las personas:", error);
      } finally {
        setIsLoadingPersonas(false);
      }
    };

    fetchPersonas();
  }, []);

  return (
    <div>
      <Header />
      <div>
        {message && <div className="alert alert-success">{message}</div>}
      </div>

      <div>
        <h2>Datos de la sesión actual:</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div>
        <h2>Lista de Personas Registradas</h2>
        {isLoadingPersonas ? (
          <p>Cargando personas...</p>
        ) : personas.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID Persona</th>
                <th className="border border-gray-300 px-4 py-2">Id Sede</th>
                <th className="border border-gray-300 px-4 py-2">Rol</th>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Correo</th>
                <th className="border border-gray-300 px-4 py-2">Teléfono</th>
                <th className="border border-gray-300 px-4 py-2">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona) => (
                <tr key={persona.id_persona}>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.id_persona}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.id_sede || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.rol || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.correo || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.telefono || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {persona.detalles || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay personas registradas.</p>
        )}
      </div>
    </div>
  );
}
