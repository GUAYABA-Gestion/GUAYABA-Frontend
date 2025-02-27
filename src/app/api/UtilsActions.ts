import Cookies from "js-cookie";

export const fetchMunicipios = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/municipios`,
      {
        headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener municipios");
    }

    return response.json();
  } catch (error) {
    throw error; // Relanzar el error para manejarlo en el componente
  }
};

export const fetchProgramas = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/programas`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al obtener programas:", error);
  }
};
