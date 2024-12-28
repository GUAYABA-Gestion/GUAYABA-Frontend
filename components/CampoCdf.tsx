"use client";

import { Cdf } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

const CampoCdf = ( {cdf_id, persona_id} : Cdf) => {
    const router = useRouter();
    if (!cdf_id || !persona_id) {
        return (<div><p className="text-red-500">Error: No existe ese CDF.</p>
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
            <th className="border px-4 py-2 dark:bg-gray-700">CDF_ID</th>
            <th className="border px-4 py-2 dark:bg-gray-700">Persona_ID</th>
          </tr>
        </thead>
        <tbody>
        <tr key={cdf_id}>
            <td className="border px-4 py-2">{cdf_id}</td>
            <td className="border px-4 py-2">{persona_id}</td>
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

export default CampoCdf