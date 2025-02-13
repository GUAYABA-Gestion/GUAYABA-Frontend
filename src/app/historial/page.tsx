"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Sede } from "../../types/api";
import { useRol } from "../../../context/RolContext";

// Interfaces para los datos
interface Logs {
    id_auditoria: number,
    tabla_afectada: string,
    operacion: 'INSERT'| 'UPDATE'| 'DELETE',
    fecha_hora: string,
    datos_anteriores: any | null,
    datos_nuevos: any | null
}

const Historial: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();

  const [logs, setHistorial] = useState<Logs[]>([]);

  const fetchHistorial = async() => {
    try {
      console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL); 
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auditoria/audit`);
      if (!response.ok) throw new Error("Failed to fetch historial");
      const data: Logs[] = await response.json();
      setHistorial(data);
    } catch (error) {
      //console.error("Error fetching historial:", error);
    }
  }
  useEffect(() => {
    fetchHistorial();
  }, [rolSimulado]);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Historial de Cambios</h1>

      {/* Tabla de Historial */}
      
        <div className="mt-6">
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                {rolSimulado === "admin" || rolSimulado === "coordinador" ? (
                  <>
                    <th className="border border-gray-300 p-2">Tabla Afectada</th>
                    <th className="border border-gray-300 p-2">Operación</th>
                    <th className="border border-gray-300 p-2">Fecha - Hora</th>
                    <th className="border border-gray-300 p-2">Datos Anteriores</th>
                    <th className="border border-gray-300 p-2">Datos Nuevos</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {logs.map((log: Partial<Logs>) => (
                <tr key={log.id_auditoria}>
                  {rolSimulado === "admin" || rolSimulado === "coordinador" ? (
                    <>
                      <td className="border border-gray-300 p-2">{log.id_auditoria}</td>
                      <td className="border border-gray-300 p-2">{log.tabla_afectada}</td>
                      <td className="border border-gray-300 p-2">{log.operacion}</td>
                      <td className="border border-gray-300 p-2">{log.fecha_hora}</td>
                      <td className="border border-gray-300 p-2">{log.datos_anteriores ? JSON.stringify(log.datos_anteriores, null, 2) : "—"}</td>
                      <td className="border border-gray-300 p-2">{log.datos_nuevos ? JSON.stringify(log.datos_nuevos, null, 2) : "—"}</td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
    </div>
  );
};

export default Historial;