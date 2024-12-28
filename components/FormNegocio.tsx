"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomButton from "./CustomButton";

const FormNegocio= () => {
    const router = useRouter();
    const [flashMessage, setFlashMessage] = useState<string | null>(null); // Estado para el mensaje flash

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}negocios`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    
          if (!response.ok) {
            throw new Error("Error al enviar los datos");
          }
          router.push("/negocio"); // Redirige a /negocio si tiene éxito
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">NIT:</label>
                        <input type="text" 
                        id="nit-input" 
                        name="nit"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="#########-#" 
                        required />
                    </div>
                    <div className="flex-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Propietario:</label>
                        <input type='number' 
                        id="propietario_id-input"
                        name='propietario_id'  
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder='##########'
                        required />
                    </div>
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID Municipio:</label>
                        <input type="number" 
                        id="municipio_id-input" 
                        name="municipio_id" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="#" 
                        required />
                    </div>
                    <div className="flex-auto">
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo Negocio:</label>
                        <input type="text"
                        id="tipo_negocio-input" 
                        name="tipo_negocio"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Sociedad por Acciones Simplificada (SAS)"
                        required/>
                    </div>
                    <div className="flex-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre:</label>
                        <input type="text" 
                        id="nombre-input"
                        name="nombre" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Dentista Pepito" 
                        required />
                    </div>
                    <div className="flex-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">Dirección:</label>
                        <input type="text" 
                        id="dir"
                        name="direccion" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="Avenida Pepito #####" 
                        required />
                    </div>
                    <div className="flex-auto w-[7.5rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900  dark:text-white">Teléfono:</label>
                        <input type="number" 
                        id="telefono-input" 
                        name="telefono"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="##########"
                        maxLength={10} 
                        minLength={10} 
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

export default FormNegocio