import Cookies from "js-cookie";
import { Edificio } from "../../types/api";

export const fetchEdificios = async (): Promise<Edificio[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    const data = await response.json();
    return data.map((edificio: any) => ({
      ...edificio,
      correo_titular: edificio.correo_titular || "",
    }));
  } catch (error) {
    console.error("Error al obtener edificios:", error);
    return [];
  }
};

export const updateEdificio = async (edificio: Edificio) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/update-edificio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(edificio),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el edificio");
    }

    const data = await response.json();
    return data.edificio;
  } catch (error) {
    console.error("Error al actualizar el edificio:", error);
    return null;
  }
};

export const deleteEdificio = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar edificio");
    }

    return response.json();
  } catch (error) {
    console.error("Error al eliminar edificio:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const addEdificiosManual = async (edificios: Edificio[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/addEdificiosManual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ edificios }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al añadir edificios");
    }

    return response.json();
  } catch (error) {
    console.error("Error al añadir edificios:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }

};

export const fetchEdificioById = async (id: string): Promise<Edificio | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el edificio");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el edificio:", error);
    return null;
  }
};