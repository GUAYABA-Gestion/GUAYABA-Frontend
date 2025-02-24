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
  id_encargado: number;
  tipo_contrato: string;
  tipo: string;
  estado: string;
  necesidad: string;
  prioridad: string;
  detalle: string;
  fecha_ini: string;
  fecha_fin: string;
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
  nombre: string;
  descripcion: string;
  hora_inicio: string;
  hora_fin: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: string;
  estado: string;
}