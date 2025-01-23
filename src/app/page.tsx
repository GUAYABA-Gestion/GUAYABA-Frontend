"use client";
import { Header } from "../../components";

export default function Home() {
  return (
    
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenedor sin bordes, pegado al header */}
      <div className="flex-1 flex flex-col md:flex-row bg-gray-50 overflow-hidden">
        {/* Sección izquierda: Texto */}
        <div className="flex-1 p-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido a Guayaba</h2>
          <p className="mt-4 text-gray-600">
            Centralizamos la información clave de la estructura educativa de tu universidad,
            facilitando la gestión y toma de decisiones respecto a los distintos espacios que la componen, para que los puedas disfrutar al máximo.
            Creemos en la innovación y la fiabilidad.
          </p>
        </div>
        {/* Sección derecha: Imagen */}
        <div className="flex-1 hidden md:block">
          <img
            src="/images/universidad.jpg"
            alt="Edificio Universitario"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
