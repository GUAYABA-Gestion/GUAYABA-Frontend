"use client";

import { Viviendas } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

const CampoResidencia = ( {id, municipio_id, tipo_vivienda, direccion, pisos, tamano, estrato, avaluo} : Viviendas) => {
    const router = useRouter();
    if (!id) {
        return (<div><p className="text-red-500">Error: No existe esa vivienda.</p>
          <CustomButton 
          title="Atrás" 
          containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
          handleClick={() => router.push("/vivienda")}
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
            <th className="border px-4 py-2 dark:bg-gray-700">Municipio ID:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Tipo Vivienda:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Dirección:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Pisos:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Tamaño:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Estrato:</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Avaluo:</th>
          </tr>
        </thead>
        <tbody>
        <tr key={id}>
            <td className="border px-4 py-2">{id}</td>
            <td className="border px-4 py-2">{municipio_id}</td>
            <td className="border px-4 py-2">{tipo_vivienda}</td>
            <td className="border px-4 py-2">{direccion}</td>
            <td className="border px-4 py-2">{pisos}</td>
            <td className="border px-4 py-2">{tamano}</td>
            <td className="border px-4 py-2">{estrato}</td>
            <td className="border px-4 py-2">{avaluo}</td>
        </tr>
        </tbody>
        </table>
          <div className="flex justify-center space-x-4 mt-10">

            <CustomButton 
                    title="Atrás" 
                    containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
                    handleClick={() => router.push("/vivienda")}
                    />
          </div> 
        </div>
    );
};

export default CampoResidencia