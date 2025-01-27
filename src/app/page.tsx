"use client";
import { Header } from "../../components";
import { Footer } from "../../components";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row bg-gray-50 overflow-hidden items-center md:items-start">
        {/* Sección izquierda: Texto */}
        <div className="flex-1 p-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido a Guayaba</h2>
          <p className="mt-4 text-gray-600">
            Centralizamos la información clave de la estructura educativa de tu universidad,
            facilitando la gestión y toma de decisiones respecto a los distintos espacios que la componen, para que los puedas disfrutar al máximo.
            Creemos en la innovación y la fiabilidad.
          </p>
          {/* Botones */}
          <div className="mt-6 flex justify-center space-x-4">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-emerald-700 transition duration-300">
              Pagar Licencia
            </button>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow-md hover:bg-gray-300 transition duration-300">
              Contáctanos
            </button>
          </div>
        </div>

        {/* Sección derecha: Imagen */}
        <div className="flex-1 p-6">
          <img
            src="/images/universidad.jpg"
            alt="Edificio Universitario"
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      </div>
      <Footer></Footer>
    </div>
    
  );
}
