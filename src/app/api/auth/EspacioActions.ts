import Cookies from "js-cookie";
import { Espacio } from "../../../types/api";

export const fetchEspacios = async (): Promise<Espacio[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/espacios/`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener espacios:", error);
    return [];
  }
};

export const updateEspacio = async (espacio: Espacio) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/espacios/update-espacio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(espacio),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el espacio");
    }

    const data = await response.json();
    return data.espacio;
  } catch (error) {
    console.error("Error al actualizar el espacio:", error);
    return null;
  }
};

export const deleteEspacio = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/espacios/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar espacio");
    }

    return response.json();
  } catch (error) {
    console.error("Error al eliminar espacio:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const addEspaciosManual = async (espacios: Espacio[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/espacios/addEspaciosManual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ espacios }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al añadir espacios");
    }

    return response.json();
  } catch (error) {
    console.error("Error al añadir espacios:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const fetchEspaciosByEdificios = async (ids_edificios: number[]): Promise<Espacio[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/espacios/by-edificios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ ids_edificios }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener espacios desde edificios");
    }

    const data = await response.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error("Error al obtener espacios desde edificios:", error);
    return [];
  }
};
