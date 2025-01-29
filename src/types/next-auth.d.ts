// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id_persona?: number | null;
      rol?: string | null;
    } & DefaultSession["user"];
    flashMessage?: string | null; // Añadido flashMessage de tipo string o null
  }

  interface User {
    id_persona?: number;
    rol?: string;
    flashMessage?: string | null; // Añadido flashMessage para el usuario
  }
}
