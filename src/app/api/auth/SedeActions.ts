import Cookies from "js-cookie";
import { User, Sede } from "../../../types/api";

export const fetchSedes = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/sedes`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    const data = response.json();  
    return data;
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    return [];
  }
};

export const fetchSedeById = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    return response.json();
  } catch (error) {
    console.error("Error al obtener sede:", error);
    return null;
  }
};

export const updateSede = async (sede: Sede) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/update-sede`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(sede),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la sede");
    }

    return response.json();
  } catch (error) {
    console.error("Error al actualizar la sede:", error);
    return null;
  }
};
