"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sede, Municipio, User, Edificio } from "../../types/api";
import { useRol } from "../../../context/RolContext";
import { fetchSedes } from "../api/SedeActions";
import { fetchMunicipios } from "../api/MunicipioActions";
import { getAdmins } from "../api/UserActions";
import { fetchEdificios } from "../api/EdificioActions";
import { Header } from "../../../components";
import SedeManager from "./components/sede/SedeManager";
import EdificioManager from "./components/edificio/EdificioManager";

const GestionSedes: React.FC = () => {
  const { data: session } = useSession();
  const { rolSimulado, idSede } = useRol();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [coordinadores, setCoordinadores] = useState<User[]>([]);
  const [selectedSedes, setSelectedSedes] = useState<number[]>([]);
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const sedesData = await fetchSedes();
      sedesData.sort((a: Sede, b: Sede) => a.id_sede - b.id_sede);
      setSedes(sedesData);
      if (rolSimulado === "admin") {
        setSelectedSedes(sedesData.map((sede: Sede) => sede.id_sede)); // Select all sedes by default
      } else {
        const userSede = sedesData.find(
          (sede: Sede) => sede.id_sede === idSede
        );
        if (userSede) {
          setSelectedSedes([userSede.id_sede]);
        }
      }
      const municipiosData = await fetchMunicipios();
      municipiosData.sort((a: Municipio, b: Municipio) => a.nombre.localeCompare(b.nombre));
      setMunicipios(municipiosData);      
      const coordinadoresData = await getAdmins();
      coordinadoresData.sort((a: User, b: User) => a.id_persona - b.id_persona);
      setCoordinadores(coordinadoresData);
      const edificiosData = await fetchEdificios();
      edificiosData.sort((a: Edificio, b: Edificio) => a.id_sede - b.id_sede);
      setEdificios(edificiosData);
      setIsLoading(false);
    };
    fetchData();
  }, [rolSimulado, idSede]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="mt-4 p-4">
        <h1 className="text-2xl font-bold text-[#034f00]">
          {rolSimulado === "admin" && "Gestión de Infraestructura"}
          {rolSimulado === "coord" && "Gestión de Sede"}
          {rolSimulado === "maint" && "Informes Sede"}
          {rolSimulado === "user" && "Buscador de edificios"}
        </h1>
        <SedeManager
          sedes={sedes}
          municipios={municipios}
          coordinadores={coordinadores}
          selectedSedes={selectedSedes}
          setSelectedSedes={setSelectedSedes}
          rolSimulado={rolSimulado}
          idSede={idSede}
          setSedes={setSedes} // Pasamos setSedes al SedeManager
        />
        <EdificioManager
          edificios={edificios}
          sedes={sedes}
          municipios={municipios}
          coordinadores={coordinadores}
          selectedSedes={selectedSedes}
          setSelectedSedes={setSelectedSedes}
          rolSimulado={rolSimulado}
          idSede={idSede}
          setEdificios={setEdificios} // Pasamos setEdificios al EdificioManager
        />
      </div>
    </div>
  );
};

export default GestionSedes;