import Cookies from "js-cookie";
import { Mantenimiento, User } from "../../types/api";

export const fetchMantenimientos = async (): Promise<Mantenimiento[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mantenimientos/`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener mantenimientos");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const updateMantenimiento = async (mantenimiento: Mantenimiento) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mantenimientos/update-mantenimiento`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(mantenimiento),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar el mantenimiento");
    }

    const data = await response.json();
    return data.mantenimiento;
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const deleteMantenimiento = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mantenimientos/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar mantenimiento");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const addMantenimientosManual = async (mantenimientos: Mantenimiento[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mantenimientos/addMantenimientosManual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ mantenimientos }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al añadir mantenimientos");
    }

    const data = await response.json();
    return data.mantenimientos;
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const fetchMantenimientosByEspacios = async (ids_espacios: number[]): Promise<Mantenimiento[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mantenimientos/by-espacios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ ids_espacios }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener mantenimientos desde espacios");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};