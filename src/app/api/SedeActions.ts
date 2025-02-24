import Cookies from "js-cookie";
import { Sede } from "../../types/api";

export const fetchSedes = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/sedes`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener sedes");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const fetchSedeById = async (id: number): Promise<Sede> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener sede");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
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
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la sede");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const addSedesManual = async (sedes: Sede[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/addSedesManual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ sedes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al añadir sedes");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const deleteSede = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar sede");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};