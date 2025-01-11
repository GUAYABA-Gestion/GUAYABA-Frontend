// src/app/api/auth/authOptions.ts

import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Definir las opciones de NextAuth
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Aquí agregamos tu lógica de sesión
      if (session.user?.email) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          const data = await response.json();

          if (data.exists) {
            session.user.id_usuario = data.user.id_usuario ?? null;
            session.user.rol = data.user.rol ?? null;
          } else {
            session.user.id_usuario = null;
            session.user.rol = null;
          }
        } catch (error) {
          console.error("Error verificando usuario:", error);
          session.user.id_usuario = null;
          session.user.rol = null;
          token.flashMessage = "Hubo un error al verificar tu cuenta.";
        }
      }

      session.flashMessage = typeof token.flashMessage === "string" ? token.flashMessage : null;
      return session;
    },

    async jwt({ token, trigger, user }) {
      if (trigger === "update" && user?.flashMessage) {
        token.flashMessage = typeof user.flashMessage === "string" ? user.flashMessage : null;
      }
      return token;
    },
  },
};
