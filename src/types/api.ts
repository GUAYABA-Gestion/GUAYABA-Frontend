export interface User {
  id_persona: number;
  correo: string;
  nombre: string;
  rol: string;
  id_sede: number;
}

export interface CheckUserResponse {
  exists: boolean;
  user?: User;
  token?: string;
}

export interface RegisterResponse {
  registered: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface Sede {
  id_sede: number;
  nombre: string;
  municipio?: number;
  coordinador?: number;
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
  id_espacio: number,
  id_edificio: number,
  nombre:string,
  estado:string,
  tipo:string,
  capacidad:string,
  mediciónmt2:number,
}