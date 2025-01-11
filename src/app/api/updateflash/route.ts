import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions"; // Importamos authOptions
import { getServerSession } from "next-auth/next";  // Usamos el import correcto para la nueva estructura

export async function POST(req: NextRequest) {
  try {
    // Usamos getServerSession con la nueva estructura de Next.js
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No hay sesión activa." }, { status: 401 });
    }

    // Establecemos el nuevo mensaje de flash
    const { flashMessage } = await req.json();
    session.flashMessage = flashMessage || "Mensaje no proporcionado";

    // Respondemos con éxito
    return NextResponse.json({ message: "Flash message actualizado correctamente." }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el flash message:", error);
    return NextResponse.json({ error: "Hubo un error al actualizar el mensaje." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
