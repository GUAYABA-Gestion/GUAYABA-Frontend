"use client";

import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Propiedades} from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import ConfirmationPopUp from "./ConfirmationPopUp";

const FormPropiedadesEdit = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pId = searchParams.get("propiedad_id");
    const [propiedad, setPropiedades] = useState<Partial<Propiedades>>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}propiedades/${pId}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error deleting propiedad");
            console.log("Item deleted!");
            setIsPopupOpen(false);
            router.push("/propiedades");
        } catch (error) {
            console.error("Error deleting propiedad:", error);
        }
    };

    useEffect(() => {
        if (pId) {
            const fetchpropiedad = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}propiedades/${pId}`);
                    if (!response.ok) throw new Error("Failed to fetch propiedad");
                    const propiedad: Propiedades = await response.json();
                    //if (propiedad.fecha_nacimiento) {
                    //    propiedad.fecha_nacimiento = new Date(propiedad.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setPropiedades(propiedad);
                } catch (error) {
                    console.error("Error fetching propiedad:", error);
                }
            };
            fetchpropiedad();
/*
            const fetchtipos = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}propiedads/${vId}`);
                    if (!response.ok) throw new Error("Failed to fetch tipo_propiedad");
                    const propiedad: propiedads = await response.json();
                    //if (propiedad.fecha_nacimiento) {
                    //    propiedad.fecha_nacimiento = new Date(propiedad.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setpropiedads(propiedad);
                } catch (error) {
                    console.error("Error fetching propiedad:", error);
                }
            };
            fetchtipos();*/
            /*
            const fetchmuni = async (mId:Number) => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}municipios/${mId}`);
                    if (!response.ok) throw new Error("Failed to fetch tipo_propiedad");
                    const municipio: Municipios = await response.json();
                    //if (propiedad.fecha_nacimiento) {
                    //    propiedad.fecha_nacimiento = new Date(propiedad.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setMunicipios(municipio);
                } catch (error) {
                    console.error("Error fetching municipio:", error);
                }
            };
            fetchmuni(propiedad.municipio_id);*/

        }
    }, [pId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const sanitizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
        );

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}propiedades/${pId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) throw new Error("Error updating propiedad");
            router.push("/propiedades");
        } catch (error) {
            console.error("Error updating propiedad:", error);
        }
    };

    if (!pId) {
        return <div>Error: No propiedad ID proveida</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID propiedad:</label>
                        <input type="number" 
                        id="propiedad_id-input" 
                        name="propiedad_id" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600"
                        value={propiedad.id || ""}
                        onChange={(e) => setPropiedades({ ...propiedad, id: Number(e.target.value) })} 
                        required 
                        disabled
                        />
                    </div>
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID propiedad:</label>
                        <input type="number" 
                        id="vivienda_id-input" 
                        name="vivienda_id" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        value={propiedad.vivienda_id || ""}
                        onChange={(e) => setPropiedades({ ...propiedad, vivienda_id: Number(e.target.value) })} 
                        required />
                    </div>
                    <div className="flex-auto w-[8rem]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">ID Propietario:</label>
                        <input type="number" 
                        id="propietario_id-input" 
                        name="propietario_id"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-600 dark:focus:border-emerald-600" 
                        value={propiedad.propietario_id || ""}
                        onChange={(e) => setPropiedades({ ...propiedad, propietario_id: Number(e.target.value) })}  
                        required />
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-10">
                    <CustomButton title="Enviar" containerStyles="bg-emerald-600 text-white rounded-lg px-6 py-2" />
                    <CustomButton
                        title="Cancelar"
                        containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2"
                        handleClick={() => router.push("/propiedades")}
                    />
                    <CustomButton
                        title="Borrar"
                        containerStyles="bg-red-600 text-white rounded-lg px-6 py-2"
                        handleClick={(e) => {
                            e.preventDefault();
                            setIsPopupOpen(true);
                        }}
                    />
                </div>
            </form>
            <ConfirmationPopUp
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleDelete}
                title="Borrar entrada?"
                message="¿Está seguro que desea eliminar esta entrada?"
            />
        </div>
    );
    
};

export default FormPropiedadesEdit;
