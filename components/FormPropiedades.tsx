"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomButton from "./CustomButton";

const FormPropiedades = () => {
    const router = useRouter();
    const [flashMessage, setFlashMessage] = useState<string | null>(null); // Estado para el mensaje flash

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}propiedades`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    
          if (!response.ok) {
            throw new Error("Error al enviar los datos.");
          }
          router.push("/propiedades"); // Redirige a /propiedades si tiene éxito
        } catch (error) {
          setFlashMessage("Hubo un error al enviar los datos. Por favor, verifica la información.");
          console.error();
        }
      };
        return(
        <div>
            {/* Mostrar el mensaje flash si existe */}
            {flashMessage && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                    {flashMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID Vivienda:</label>
                        <input type="number" 
                        id="vivienda_id-input" 
                        name="vivienda_id" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="##########" 
                        required />
                    </div>
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID Propietario:</label>
                        <input type="number" 
                        id="propietario_id-input" 
                        name="propietario_id"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="##########" 
                        required />
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-10">
                    <CustomButton title="Enviar" containerStyles="bg-emerald-600 text-white rounded-lg px-6 py-2" />
                    <CustomButton 
                        title="Cancelar" 
                        containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2" 
                        handleClick={() => router.back()}
                    />
                </div> 
            </form>
        </div>
    )
};

export default FormPropiedades