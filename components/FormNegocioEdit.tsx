"use client";

import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Negocios} from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import ConfirmationPopUp from "./ConfirmationPopUp";

const FormNegocioEdit = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nId = searchParams.get("negocio_nit");
    const [negocio, setNegocios] = useState<Partial<Negocios>>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}negocios/${nId}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error deleting negocio");
            console.log("Item deleted!");
            setIsPopupOpen(false);
            router.push("/negocio");
        } catch (error) {
            console.error("Error deleting negocio:", error);
        }
    };

    useEffect(() => {
        if (nId) {
            const fetchnegocio = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}negocios/${nId}`);
                    if (!response.ok) throw new Error("Failed to fetch negocio");
                    const negocio: Negocios = await response.json();
                    //if (negocio.fecha_nacimiento) {
                    //    negocio.fecha_nacimiento = new Date(negocio.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setNegocios(negocio);
                } catch (error) {
                    console.error("Error fetching negocio:", error);
                }
            };
            fetchnegocio();
/*
            const fetchtipos = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}negocios/${vId}`);
                    if (!response.ok) throw new Error("Failed to fetch tipo_negocio");
                    const negocio: negocios = await response.json();
                    //if (negocio.fecha_nacimiento) {
                    //    negocio.fecha_nacimiento = new Date(negocio.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setnegocios(negocio);
                } catch (error) {
                    console.error("Error fetching negocio:", error);
                }
            };
            fetchtipos();*/
            /*
            const fetchmuni = async (mId:Number) => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}municipios/${mId}`);
                    if (!response.ok) throw new Error("Failed to fetch tipo_negocio");
                    const municipio: Municipios = await response.json();
                    //if (negocio.fecha_nacimiento) {
                    //    negocio.fecha_nacimiento = new Date(negocio.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setMunicipios(municipio);
                } catch (error) {
                    console.error("Error fetching municipio:", error);
                }
            };
            fetchmuni(negocio.municipio_id);*/

        }
    }, [nId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const sanitizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
        );

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}negocios/${nId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) throw new Error("Error updating negocio");
            router.push("/negocio");
        } catch (error) {
            console.error("Error updating negocio:", error);
        }
    };

    if (!nId) {
        return <div>Error: No negocio ID proveida</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-6xl p-8 bg-black shadow-lg rounded-lg">
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NIT:</label>
                        <input
                            type="text"
                            name="NIT"
                            value={negocio.nit || ""}
                            onChange={(e) => setNegocios({ ...negocio, nit:e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Propietario:</label>
                        <input
                            type="number"
                            name="propietario_id"
                            value={negocio.propietario_id || ""}
                            onChange={(e) => setNegocios({ ...negocio, propietario_id: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div className="col-span-3">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Municipio:</label>
                        <input
                            type="number"
                            name="municipio_id"
                            value={negocio.municipio_id || ""}
                            onChange={(e) => setNegocios({ ...negocio, municipio_id: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo Negocio:</label>
                        <input
                            type="text"
                            name="tipo_negocio"
                            value={negocio.tipo_negocio || ""}
                            onChange={(e) => setNegocios({ ...negocio, tipo_negocio: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            //max={current}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={negocio.nombre || ""}
                            onChange={(e) => setNegocios({ ...negocio, nombre: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direccion:</label>
                        <input
                            type="text"
                            name="direccion"
                            value={negocio.direccion || ""}
                            onChange={(e) => setNegocios({ ...negocio, direccion: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teléfono:</label>
                        <input
                            type="number"
                            name="telefono"
                            value={negocio.telefono || ""}
                            onChange={(e) => setNegocios({ ...negocio, telefono: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            maxLength={10}
                            minLength={10}
                            required
                        />
                    </div>

                </div>
                <div className="flex justify-center space-x-4 mt-10">
                    <CustomButton title="Enviar" containerStyles="bg-emerald-600 text-white rounded-lg px-6 py-2" />
                    <CustomButton
                        title="Cancelar"
                        containerStyles="bg-gray-600 text-white rounded-lg px-6 py-2"
                        handleClick={() => router.back()}
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

export default FormNegocioEdit;
