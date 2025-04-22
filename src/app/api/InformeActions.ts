import Cookies from "js-cookie";
import { Edificio } from "../../types/api";

// Nueva función para obtener métricas agrupadas
export const fetchMetricasEdificioAgrupadas = async (idsSedes: number[]): Promise<any> => {
    try {
      // Validar que se proporcionen IDs de sedes
      if (!Array.isArray(idsSedes) || idsSedes.length === 0) {
        throw new Error("Debe proporcionar una lista de IDs de sedes válida.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edificios/metricas-agrupadas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify({ ids_sedes: idsSedes }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener métricas agrupadas");
      }
  
      const data = await response.json();
      return data.data; // Retornar los datos agrupados
    } catch (error) {
      console.error("Error en fetchMetricasEdificioAgrupadas:", error);
      throw error; // Relanzar el error para manejarlo en el componente
    }
  };
  