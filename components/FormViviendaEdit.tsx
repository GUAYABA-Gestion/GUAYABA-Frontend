"use client";

import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Viviendas } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import ConfirmationPopUp from "./ConfirmationPopUp";

const FormViviendaEdit = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vId = searchParams.get("vivienda_id");
    const [vivienda, setViviendas] = useState<Partial<Viviendas>>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}Viviendas/${vId}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error deleting vivienda");
            console.log("Item deleted!");
            setIsPopupOpen(false);
            router.push("/vivienda");
        } catch (error) {
            console.error("Error deleting vivienda:", error);
        }
    };

    useEffect(() => {
        if (vId) {
            const fetchvivienda = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}viviendas/${vId}`);
                    if (!response.ok) throw new Error("Failed to fetch vivienda");
                    const vivienda: Viviendas = await response.json();
                    //if (vivienda.fecha_nacimiento) {
                    //    vivienda.fecha_nacimiento = new Date(vivienda.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setViviendas(vivienda);
                } catch (error) {
                    console.error("Error fetching vivienda:", error);
                }
            };
            fetchvivienda();
/*
            const fetchtipos = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}viviendas/${vId}`);
                    if (!response.ok) throw new Error("Failed to fetch tipo_vivienda");
                    const vivienda: Viviendas = await response.json();
                    //if (vivienda.fecha_nacimiento) {
                    //    vivienda.fecha_nacimiento = new Date(vivienda.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setViviendas(vivienda);
                } catch (error) {
                    console.error("Error fetching vivienda:", error);
                }
            };
            fetchtipos();*/
            /*
            const fetchmuni = async (mId:Number) => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}municipios/${mId}`);
                    if (!response.ok) throw new Error("Failed to fetch tipo_vivienda");
                    const municipio: Municipios = await response.json();
                    //if (vivienda.fecha_nacimiento) {
                    //    vivienda.fecha_nacimiento = new Date(vivienda.fecha_nacimiento).toISOString().split("T")[0];
                    //}
                    setMunicipios(municipio);
                } catch (error) {
                    console.error("Error fetching municipio:", error);
                }
            };
            fetchmuni(vivienda.municipio_id);*/

        }
    }, [vId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const sanitizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
        );

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}viviendas/${vId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) throw new Error("Error updating vivienda");
            router.push("/vivienda");
        } catch (error) {
            console.error("Error updating vivienda:", error);
        }
    };

    if (!vId) {
        return <div>Error: No vivienda ID proveida</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-6xl p-8 bg-black shadow-lg rounded-lg">
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID:</label>
                        <input
                            type="number"
                            name="id"
                            value={vivienda.id || ""}
                            onChange={(e) => setViviendas({ ...vivienda, id: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            disabled
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Municipio:</label>
                        <select
                            name="municipio_id"
                            value={vivienda.municipio_id || ""}
                            onChange={(e) => setViviendas({ ...vivienda, municipio_id: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="" disabled>Seleccione un municipio</option>
                            <option value="1">Medellín</option>
                            <option value="2">Bogotá</option>
                            <option value="3">Cali</option>
                            <option value="4">Barranquilla</option>
                            <option value="5">Cartagena</option>
                            <option value="6">Cúcuta</option>
                            <option value="7">Pereira</option>
                            <option value="8">Santa Marta</option>
                            <option value="9">Bucaramanga</option>
                            <option value="10">Manizales</option>
                            <option value="11">Neiva</option>
                            <option value="12">Sincelejo</option>
                            <option value="13">Ibagué</option>
                            <option value="14">Valledupar</option>
                            <option value="15">Popayán</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo Vivienda:</label>
                        <select
                            name="tipo_vivienda"
                            value={vivienda.tipo_vivienda || ""}
                            onChange={(e) => setViviendas({ ...vivienda, tipo_vivienda: String(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="" disabled>
                                Seleccione una opción
                            </option>
                            <option value="Chalet">Chalet</option>
                            <option value="Piso">Piso</option>
                            <option value="Duplex">Dúplex</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Casa de campo">Casa de Campo</option>
                            <option value="Bungalow">Bungalow</option>
                            <option value="Cabaña">Cabaña</option>
                            <option value="Estudio">Estudio</option>
                            <option value="Casa">Casa</option>
                        </select>
                    </div>
                    <div className="col-span-3">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direccion:</label>
                        <input
                            type="text"
                            name="direccion"
                            value={vivienda.direccion || ""}
                            onChange={(e) => setViviendas({ ...vivienda, direccion: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">#Pisos:</label>
                        <input
                            type="number"
                            name="pisos"
                            value={vivienda.pisos || ""}
                            onChange={(e) => setViviendas({ ...vivienda, pisos: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            max={50}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tamaño (KM^2):</label>
                        <input
                            type="number"
                            name="tamano"
                            value={vivienda.tamano || ""}
                            onChange={(e) => setViviendas({ ...vivienda, tamano: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                    
                        </input>
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estrato:</label>
                        <select
                            name="estrato"
                            value={vivienda.estrato || ""}
                            onChange={(e) => setViviendas({ ...vivienda, estrato: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="" disabled>
                                Seleccione una opción
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="5">6</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avaluo:</label>
                        <input
                            type="number"
                            name="avaluo"
                            value={vivienda.avaluo || ""}
                            onChange={(e) => setViviendas({ ...vivienda, avaluo: Number(e.target.value)})}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
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

export default FormViviendaEdit;
