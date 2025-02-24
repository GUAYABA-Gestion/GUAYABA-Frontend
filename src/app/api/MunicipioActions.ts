import Cookies from "js-cookie";

export const fetchMunicipios = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/municipios`, {
      headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener municipios");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};