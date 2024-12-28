"use client";

import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Personas } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";
import ConfirmationPopUp from "./ConfirmationPopUp";

const current = new Date().toISOString().split("T")[0];

const FormPersonaEdit = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pId = searchParams.get("persona_id");
    const [persona, setPersona] = useState<Partial<Personas>>({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}personas/${pId}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Error deleting persona");
            console.log("Item deleted!");
            setIsPopupOpen(false);
            router.push("/persona");
        } catch (error) {
            console.error("Error deleting persona:", error);
        }
    };

    useEffect(() => {
        if (pId) {
            const fetchPersona = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}personas/${pId}`);
                    if (!response.ok) throw new Error("Failed to fetch persona");
                    const persona: Personas = await response.json();
                    if (persona.fecha_nacimiento) {
                        persona.fecha_nacimiento = new Date(persona.fecha_nacimiento).toISOString().split("T")[0];
                    }
                    setPersona(persona);
                } catch (error) {
                    console.error("Error fetching persona:", error);
                }
            };
            fetchPersona();
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}personas/${pId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) throw new Error("Error updating persona");
            router.push("/persona");
        } catch (error) {
            console.error("Error updating persona:", error);
        }
    };

    if (!pId) {
        return <div>Error: No persona ID provided</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-6xl p-8 bg-black shadow-lg rounded-lg">
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DNI:</label>
                        <input
                            type="number"
                            name="id"
                            value={persona.dni || ""}
                            onChange={(e) => setPersona({ ...persona, dni: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            disabled
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Residencia:</label>
                        <input
                            type="number"
                            name="residencia_id"
                            value={persona.residencia_id || ""}
                            onChange={(e) => setPersona({ ...persona, residencia_id: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID Cabeza Familia:</label>
                        <input
                            type="number"
                            name="cdf_id"
                            value={persona.cdf_id || ""}
                            onChange={(e) => setPersona({ ...persona, cdf_id: Number(e.target.value) })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div className="col-span-3">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre Completo:</label>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={persona.nombre_completo || ""}
                            onChange={(e) => setPersona({ ...persona, nombre_completo: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha Nacimiento:</label>
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            value={persona.fecha_nacimiento || ""}
                            onChange={(e) => setPersona({ ...persona, fecha_nacimiento: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            max={current}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sexo:</label>
                        <select
                            name="sexo"
                            value={persona.sexo || ""}
                            onChange={(e) => setPersona({ ...persona, sexo: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="F">Mujer</option>
                            <option value="M">Hombre</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={persona.email || ""}
                            onChange={(e) => setPersona({ ...persona, email: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teléfono:</label>
                        <input
                            type="number"
                            name="telefono"
                            value={persona.telefono || ""}
                            onChange={(e) => setPersona({ ...persona, telefono: e.target.value })}
                            className="bg-gray-50 border rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            maxLength={10}
                            minLength={10}
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Célular:</label>
                        <input
                            type="number"
                            name="celular"
                            value={persona.celular || ""}
                            onChange={(e) => setPersona({ ...persona, celular: e.target.value })}
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

export default FormPersonaEdit;
