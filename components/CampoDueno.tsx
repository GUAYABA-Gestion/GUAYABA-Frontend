"use client";

import { Personas } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

const CampoDueno = ( {dni, residencia_id, cdf_id, nombre_completo, fecha_nacimiento, sexo, email, telefono, celular} : Personas) => {
    const router = useRouter();
    if (!dni) {
        return (<div><p className="text-red-500">Error: No existe esa persona.</p>
          <CustomButton 
          title="Atrás" 
          containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
          handleClick={() => router.push("/persona")}
          />
          </div>
        );
    }

    return (
      <div>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 dark:bg-gray-700">DNI:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Residencia ID:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">CDF ID:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Nombre Completo:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Fecha Nacimiento:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Sexo</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Email</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Telefono</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Celular</th>
          </tr>
        </thead>
        <tbody>
        <tr key={dni}>
            <td className="border px-4 py-2">{dni}</td>
            <td className="border px-4 py-2">{residencia_id}</td>
            <td className="border px-4 py-2">{cdf_id}</td>
            <td className="border px-4 py-2">{nombre_completo}</td>
            <td className="border px-4 py-2">{fecha_nacimiento}</td>
            <td className="border px-4 py-2">{sexo}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">{telefono}</td>
            <td className="border px-4 py-2">{celular}</td>
        </tr>
        </tbody>
        </table>
          <div className="flex justify-center space-x-4 mt-10">
            <CustomButton 
                    title="Atrás" 
                    containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
                    handleClick={() => router.push("/persona")}
                    />
          </div> 
        </div>
    );
};

export default CampoDueno