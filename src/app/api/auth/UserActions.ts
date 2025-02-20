import Cookies from "js-cookie";
import { User } from "../../../types/api";

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getAll`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    return response.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

export const fetchSedes = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sedes/sedes`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    return response.json();
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    return [];
  }
};

export const addUsersManual = async (users: any[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ users }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al añadir usuarios");
    }

    return response.json();
  } catch (error) {
    console.error("Error al añadir usuarios front:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const deleteUserManual = async (id_persona: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/deleteManual`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ id_persona }),
    });
    return response.json();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
};

export const updateUser = async (user: User) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }

    return response.json(); // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};

export const getUserReferences = async (id_persona: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/references`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      body: JSON.stringify({ id_persona }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener referencias del usuario");
    }

    return response.json();
  } catch (error) {
    console.error("Error al obtener referencias del usuario:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const getAdmins = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getAdmins`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    return response.json();
  } catch (error) {
    console.error("Error al obtener usuarios por rol:", error);
    return [];
  }
};

export const fetchUser = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }

    return response.json();
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error; // Relanzar el error para manejarlo en el componente
  }
};