"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Sede } from "../../types/api";
import { useRol } from "../../../context/RolContext";

// Interfaces para los datos
interface Edificio {
  id_edificio: number;
  id_sede: number;
  id_titular: number;
  nombre: string;
  dirección: string;
  categoría: string;
  propiedad: string;
  area_terreno: number;
  area_construida: number;
  cert_uso_suelo: boolean;
}

const GestionSedes: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado } = useRol();

  // Datos simulados
  // const sedes: Sede[] = [
  //   { id_sede: 1, nombre: "Sede Norte", municipio: "Bogotá", coordinador: "Juan Pérez" },
  //   { id_sede: 2, nombre: "Sede Sur", municipio: "Medellín", coordinador: "Ana Gómez" },
  // ];

  // const edificios: Edificio[] = [
  //   {
  //     id_edificio: 1,
  //     id_sede: 1,
  //     id_titular: 101,
  //     nombre: "Edificio A",
  //     dirección: "Calle 123",
  //     categoría: "Académico",
  //     propiedad: "Pública",
  //     area_terreno: 5000,
  //     area_construida: 4500,
  //     cert_uso_suelo: true,
  //   },
  //   {
  //     id_edificio: 2,
  //     id_sede: 2,
  //     id_titular: 102,
  //     nombre: "Edificio B",
  //     dirección: "Carrera 45",
  //     categoría: "Administrativo",
  //     propiedad: "Privada",
  //     area_terreno: 3000,
  //     area_construida: 2800,
  //     cert_uso_suelo: false,
  //   },
  // ];

  const [sedeSeleccionada, setSedeSeleccionada] = useState<number | null>(null);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);

  const fetchSedes = async () => {
    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

      const response = await fetch(
        `${process.env.NEXT_PUBLICK_BACKEND_URL}/api/sedes`,
        {
          headers: {
            Authorization: `Bearer ${session?.googleToken}`
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch sedes");
      const data: Sede[] = await response.json();
      setSedes(data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  }

  const fetchEdificios = async() => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLICK_BACKEND_URL}edificios`);
      if (!response.ok) throw new Error("Failed to fetch edificios");
      const data: Edificio[] = await response.json();
      setEdificios(data);
    } catch (error) {
      //console.error("Error fetching edificios:", error);
    }
  }

  // Seleccionar automáticamente la primera sede para administradores
  useEffect(() => {
    fetchSedes();

    if (rolSimulado === "admin" && sedes!.length > 0) {
      setSedeSeleccionada(sedes![0].id_sede);
    }
  }, [rolSimulado]);

  // Filtrar sedes visibles según el rol
  const sedesVisibles: Sede[] =
    rolSimulado === "admin"
      ? sedes
      : rolSimulado === "coordinador"
      ? sedes.filter((sede) => sede.coordinador === 1) // Lógica del coordinador autenticado
      : sedes.filter((sede) => edificios.some((edificio) => edificio.id_sede === sede.id_sede));

  // Filtrar edificios visibles según el rol y sede seleccionada
  const edificiosVisibles: Partial<Edificio>[] =
    rolSimulado === "admin" || rolSimulado === "coordinador"
      ? edificios.filter((edificio) => !sedeSeleccionada || edificio.id_sede === sedeSeleccionada)
      : edificios
          .filter((edificio) => !sedeSeleccionada || edificio.id_sede === sedeSeleccionada)
          .map(({ id_edificio, nombre }) => ({ id_edificio, nombre })); // Mostrar solo nombres

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Gestión de Sedes</h1>

      {/* Tabla de Sedes */}
      {sedesVisibles.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Sedes Disponibles</h2>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nombre</th>
                <th className="border border-gray-300 p-2">Municipio</th>
                {rolSimulado === "admin" || rolSimulado === "coordinador" ? (
                  <th className="border border-gray-300 p-2">Coordinador</th>
                ) : null}
                <th className="border border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sedesVisibles.map((sede) => (
                <tr key={sede.id_sede}>
                  <td className="border border-gray-300 p-2">{sede.nombre}</td>
                  <td className="border border-gray-300 p-2">{sede.municipio}</td>
                  {rolSimulado === "admin" || rolSimulado === "coordinador" ? (
                    <td className="border border-gray-300 p-2">{sede.coordinador}</td>
                  ) : null}
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => setSedeSeleccionada(sede.id_sede)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Ver Edificios
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla de Edificios */}
      {edificiosVisibles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">
            {sedeSeleccionada
              ? `Edificios de la Sede: ${
                  sedes.find((sede) => sede.id_sede === sedeSeleccionada)?.nombre
                }`
              : "Lista de Edificios"}
          </h2>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nombre</th>
                {rolSimulado === "admin" || rolSimulado === "coordinador" ? (
                  <>
                    <th className="border border-gray-300 p-2">Dirección</th>
                    <th className="border border-gray-300 p-2">Categoría</th>
                    <th className="border border-gray-300 p-2">Propiedad</th>
                    <th className="border border-gray-300 p-2">Área Terreno</th>
                    <th className="border border-gray-300 p-2">Área Construida</th>
                    <th className="border border-gray-300 p-2">Cert. Uso de Suelo</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {edificiosVisibles.map((edificio: Partial<Edificio>) => (
                <tr key={edificio.id_edificio}>
                  <td className="border border-gray-300 p-2">
                    <a
                      href={`/edificios/${edificio.id_edificio}`}
                      className="text-blue-600 hover:underline"
                    >
                      {edificio.nombre}
                    </a>
                  </td>
                  {rolSimulado === "admin" || rolSimulado === "coordinador" ? (
                    <>
                      <td className="border border-gray-300 p-2">{edificio.dirección}</td>
                      <td className="border border-gray-300 p-2">{edificio.categoría}</td>
                      <td className="border border-gray-300 p-2">{edificio.propiedad}</td>
                      <td className="border border-gray-300 p-2">{edificio.area_terreno} m²</td>
                      <td className="border border-gray-300 p-2">{edificio.area_construida} m²</td>
                      <td className="border border-gray-300 p-2">
                        {edificio.cert_uso_suelo ? "Sí" : "No"}
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionSedes;
