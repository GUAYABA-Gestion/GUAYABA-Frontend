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
      {/* Nueva Sección: Misión y Visión */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bloque Misión */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
            <p className="text-lg text-gray-300">
              En GUAYABA, diseñamos, desarrollamos y mejoramos constantemente una plataforma que centraliza la información clave de la infraestructura educativa, 
              facilitando su seguimiento y planificación. Nos enfocamos en consolidar datos, generar informes útiles y promover herramientas confiables que respalden 
              la toma de decisiones estratégicas, con el compromiso de abordar los retos del sector educativo de forma efectiva y sostenible.
            </p>
          </div>

          {/* Bloque Visión */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
            <p className="text-lg text-gray-300">
              Para 2027, ser una opción confiable y accesible en Colombia para la gestión integral de infraestructura educativa, 
              destacándonos por nuestro rigor en procesos como la consolidación de información clave, el seguimiento del uso de espacios 
              y la planificación horaria. Buscamos superar las limitaciones actuales del sector mediante soluciones innovadoras que respalden 
              la toma de decisiones informadas, favoreciendo la eficiencia y sostenibilidad en la gestión educativa.
            </p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
    
  );
}
