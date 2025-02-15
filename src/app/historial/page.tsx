"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { useRol } from "../../../context/RolContext";

// Interfaces para los datos
interface Log {
  id_auditoria: number;
  tabla_afectada: string;
  operacion: "INSERT" | "UPDATE" | "DELETE";
  fecha_hora: string;
  datos_anteriores: any | null;
  datos_nuevos: any | null;
}

const Historial: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();
  const [logs, setHistorial] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!rolSimulado || rolSimulado === "none") return;

    const fetchHistorial = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auditoria/audit`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch historial");

        const data: Log[] = await response.json();
        setHistorial(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error("Error fetching historial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorial();
  }, [rolSimulado]);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredLogs(logs); // Si no hay fecha, mostrar todos
      return;
    }

    const filtered = logs.filter((log) => {
      const logDate = new Date(log.fecha_hora).toISOString().split("T")[0]; // Extrae YYYY-MM-DD
      return logDate === selectedDate;
    });

    setFilteredLogs(filtered);
  }, [selectedDate, logs]);

  if (!rolSimulado || rolSimulado === "none" || rolSimulado =="user" || rolSimulado == "maint" || rolSimulado == "coord") {
    return <p className="text-gray-500 text-center mt-4">No tienes permisos para ver el historial.</p>;
  }

  if (isLoading) {
    return <div className="p-4 text-gray-600">Cargando historial...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-black mb-4 text-center">Historial de Cambios</h1>

      {/* Filtro por fecha */}
      <div className="mb-4 flex justify-center items-center">
        <label className="mr-2 text-black font-medium">Filtrar por fecha:</label>
        <input
          type="date"
          className="p-2 border border-gray-300 rounded-lg text-black"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse text-black">
          <thead>
            <tr className="bg-[#C2E7D1] text-black">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Tabla Afectada</th>
              <th className="p-3 border">Operación</th>
              <th className="p-3 border">Fecha - Hora</th>
              <th className="p-3 border">Datos Anteriores</th>
              <th className="p-3 border">Datos Nuevos</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id_auditoria} className="border-t">
                  <td className="p-3 text-center">{log.id_auditoria}</td>
                  <td className="p-3">{log.tabla_afectada}</td>
                  <td
                    className={`p-3 text-center font-medium border ${
                      log.operacion === "INSERT"
                        ? "bg-[#C2E7D1] text-black"
                        : log.operacion === "UPDATE"
                        ? "bg-yellow-100 text-black"
                        : "bg-red-100 text-black"
                    }`}
                  >
                    {log.operacion}
                  </td>
                  <td className="p-3 text-center">{new Date(log.fecha_hora).toLocaleString()}</td>
                  <td className="p-3">
                    {log.datos_anteriores ? (
                      <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
                        {JSON.stringify(log.datos_anteriores, null, 2)}
                      </pre>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3">
                    {log.datos_nuevos ? (
                      <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
                        {JSON.stringify(log.datos_nuevos, null, 2)}
                      </pre>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No hay registros para esta fecha.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historial;
