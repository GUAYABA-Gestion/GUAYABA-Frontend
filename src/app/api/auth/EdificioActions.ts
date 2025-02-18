import Cookies from "js-cookie";
import { Edificio } from "../../../types/api";

export const fetchEdificios = async (): Promise<Edificio[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener edificios:", error);
    return [];
  }
};
