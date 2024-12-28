"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomButton from "./CustomButton";

const current = new Date().toISOString().split("T")[0];


const FormPersona = () => {
    const router = useRouter();
    const [flashMessage, setFlashMessage] = useState<string | null>(null); // Estado para el mensaje flash

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
            // Convertir campos vacíos en null para evitar errores de BD
        const sanitizedData = {
        ...data,
        dni: data.dni,
        residencia_id: data.residencia_id,
        cdf_id: data.cdf_id || null,
        nombre_completo: data.nombre_completo || "test",
        telefono: data.telefono,
        celular: data.celular,
        };

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}personas`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sanitizedData),
          });
    
          if (!response.ok) {
            throw new Error("Error al enviar los datos");
          }
          router.push("/persona"); // Redirige a /persona si tiene éxito
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID:</label>
                        <input type="number" 
                        id="dni-input"
                        name="dni" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="##########" 
                        required />
                    </div>
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID Residencia:</label>
                        <input type="number" 
                        id="residencia_id-input" 
                        name="residencia_id" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="##########" 
                        />
                    </div>
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID Cabeza Familia:</label>
                        <input type="number" 
                        id="cdf_id-input" 
                        name="cdf_id"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="##########" 
                        />
                    </div>
                    <div className="flex-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">Nombre Completo:</label>
                        <input type="text" 
                        id="nombre_completo"
                        name="nombre_completo" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="Pépito Perez" 
                         />
                    </div>
                    <div className="flex-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha Nacimiento:</label>
                        <input type='date' 
                        id="nacimiento"
                        name='fecha_nacimiento'  
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder='Día/Mes/Año'
                        max={current}/>
                    </div>
                    <div className="flex-auto">
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sexo:</label>
                        <select 
                        id="sexo" 
                        name="sexo"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required>
                            <option value="F">Mujer</option>
                            <option value="M">Hombre</option>
                        </select>
                    </div>
                    <div className="flex-auto">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                        <input type="email" 
                        id="email"
                        name="email" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="john.doe@company.com" 
                        required />
                    </div>
                    <div className="flex-auto w-[7.5rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900  dark:text-white">Teléfono:</label>
                        <input type="number" 
                        id="numero-input" 
                        name="telefono"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        placeholder="9021013527" 
                        required />
                    </div>
                    <div className="flex-auto w-[7.5rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900  dark:text-white">Célular:</label>
                        <input type="number" 
                        id="numero-input" 
                        name="celular"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" placeholder="9021013527" required />
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

export default FormPersona
