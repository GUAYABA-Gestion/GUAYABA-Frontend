import Cookies from "js-cookie";

export const fetchMunicipios = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/municipios`, {
        headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener municipios:", error);
        return [];
    }
    }