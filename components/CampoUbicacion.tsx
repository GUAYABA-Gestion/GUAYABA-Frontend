"use client";

import { Municipios } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

const CampoUbicacion = ( {id, nombre, gobernador_id, habitantes, area} : Municipios) => {
    const router = useRouter();
    if (!id) {
        return (<div><p className="text-red-500">Error: No existe ese municipio.</p>
          <CustomButton 
          title="Atrás" 
          containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
          handleClick={() => router.push("/municipio")}
          />
          </div>
        );
    }

    return (
      <div>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 dark:bg-gray-700">ID:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Nombre:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Gobernador ID:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Habitantes:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Área:</th>
          </tr>
        </thead>
        <tbody>
        <tr key={id}>
            <td className="border px-4 py-2">{id}</td>
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">{gobernador_id}</td>
            <td className="border px-4 py-2">{habitantes}</td>
            <td className="border px-4 py-2">{area}</td>
        </tr>
        </tbody>
        </table>
          <div className="flex justify-center space-x-4 mt-10">
            <CustomButton 
                    title="Atrás" 
                    containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
                    handleClick={() => router.push("/municipio")}
                    />
          </div> 
        </div>
    );
};

export default CampoUbicacion