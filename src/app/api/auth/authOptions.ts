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
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.googleToken = account.id_token; // Guardar token de Google
      }
      return token;
    },
    async session({ session, token }) {
      session.googleToken = token.googleToken as string; // Exponerlo en la sesión
      return session;
    },
  },

};
