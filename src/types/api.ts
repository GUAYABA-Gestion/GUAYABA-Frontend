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