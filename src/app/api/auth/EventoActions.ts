import Cookies from "js-cookie";
import { Evento } from "../../../types/api";

export const fetchEventos = async (): Promise<Evento[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/eventos/`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
};

export const updateEvento = async (evento: Evento) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/eventos/update-evento`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(evento),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el evento");
    }

    const data = await response.json();
    return data.evento;
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    return null;
  }
};

export const deleteEvento = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/eventos/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar evento");
    }

    return response.json();
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const addEventosManual = async (eventos: Evento[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/eventos/addEventosManual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ eventos }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al añadir eventos");
    }

    return response.json();
  } catch (error) {
    console.error("Error al añadir eventos:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const fetchEventosByEspacios = async (ids_espacios: number[]): Promise<Evento[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/eventos/by-espacios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ ids_espacios }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener eventos desde espacios");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener eventos desde espacios:", error);
    return [];
  }
};