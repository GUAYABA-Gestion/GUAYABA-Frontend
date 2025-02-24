// src/app/layout.tsx (RootLayout)
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionWrapper from "../../components/SessionWrapper";
import { RolProvider } from "../../context/RolContext"; // Importar el RolProvider
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guayaba Gestión",
  description: "Mejorando la gestión de tus espacios.",
};

export const viewport: Viewport = {
  width: 'device-width',          // Ajusta el ancho al ancho del dispositivo
  initialScale: 1,                // Establece la escala inicial (1 = 100%)
  maximumScale: 1,                // Evita que el usuario haga zoom (aquí lo limitamos a 1)
  minimumScale: 1,                // Asegura que no se pueda hacer zoom por debajo del valor 1
  userScalable: false,            // Desactiva la opción de hacer zoom manualmente
  viewportFit: 'cover',           // Asegura que el contenido cubra toda la pantalla (útil en dispositivos con notch)
  // A continuación hay opciones menos comunes que puedes incluir si es necesario:
  // interactiveWidget: 'resizes-visual',  // Utiliza este valor para hacer que los widgets interactivos cambien de tamaño visualmente
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap with SessionWrapper first, then include RolProvider */}
        <SessionWrapper>
          <RolProvider>
            <div className="flex flex-col min-h-screen w-full">
              {/* Main content */}
              <main className="flex-grow">{children}</main>
            </div>
          </RolProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}