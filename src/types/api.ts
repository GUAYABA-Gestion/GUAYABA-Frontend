import { DateTime } from "next-auth/providers/kakao";

export interface User {
  id_persona: number;
  correo: string;
  nombre: string;
  telefono: string;
  rol: string;
  detalles: string;
  sede_nombre: string;
  id_sede?: number;
  es_manual: boolean;
}

export interface Sede {
  id_sede: number;
  nombre: string;
  municipio: number;
  coordinador: number | null;
  nombre_municipio: string;
  nombre_coordinador: string | null;
}

export interface Edificio {
  id_edificio: number;
  id_sede: number;
  id_titular: number | null;
  nombre: string;
  dirección: string;
  categoría: string;
  propiedad: string;
  area_terreno: number;
  area_construida: number;
  cert_uso_suelo: boolean;
  nombre_sede: string;
  correo_titular: string | null;
}

export interface CheckUserResponse {
  exists: boolean;
  user?: User;
  token?: string;
}

export interface Municipio {  
  id: number;
  nombre: string;
}

export interface RegisterResponse {
  registered: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface Mantenimiento {
  id_mantenimiento: number;
  id_espacio: number;
  id_encargado: number | null;
  tipo_contrato: string;
  tipo: string;
  estado: string;
  necesidad: string;
  prioridad: string;
  detalle: string;
  fecha_asignacion: string;
  plazo_ideal: number;
  terminado: boolean;
  observación: string;
}

export interface Espacio {
  id_espacio: number;
  id_edificio: number;
  nombre: string;
  estado: string;
  clasificacion: string;
  uso: string;
  tipo: string;
  piso: string;
  capacidad: number;
  mediciónmt2: number;
}

export interface Evento {
  id_evento: number;
  id_espacio: number;
  tipo: string | null;
  nombre: string | null;
  descripcion: string | null;
  id_programa: number;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
  días: string | null;
  estado: string;
  unique_id?: string; // Campo adicional para el ID único generado
}

export interface Log {
  id_auditoria: number;
  tabla_afectada: string;
  operacion: "INSERT" | "UPDATE" | "DELETE";
  fecha_hora: string;
  datos_anteriores: JSON;
  datos_nuevos: JSON;
  id_persona: number;
}