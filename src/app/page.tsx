"use client";
import { Header } from "../../components";
import { Footer } from "../../components";
import {FuncionalidadesCarousel} from "../../components";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row bg-gray-50 overflow-hidden items-center md:items-start">
        {/* Sección izquierda: Texto */}
        <div className="flex-1 p-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            Bienvenido a Guayaba
          </h2>
          <p className="mt-4 text-gray-600">
            Centralizamos la información clave de la estructura educativa de tu
            universidad, facilitando la gestión y toma de decisiones respecto a
            los distintos espacios que la componen, para que los puedas
            disfrutar al máximo. Creemos en la innovación y la fiabilidad.
          </p>
          {/* Botones */}
          <div className="mt-6 flex justify-center space-x-4">
          <form method="get" action="/wompi">
            <button
            className="bg-[#80BA7F] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300">
              Pagar Licencia
            </button>
            </form>
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

      <FuncionalidadesCarousel />

      {/* Sección: Misión y Visión */}
      <div className="bg-[#F1F5F3] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Bloque Misión */}
          <div className="flex items-start space-x-6">
            <img
              src="/images/mision.png"
              alt="Misión"
              className="w-40 h-40 object-contain self-start"
            />
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-[#034f00] mb-4">
                Nuestra Misión
              </h3>
              <p className="text-lg text-gray-700">
                Con Guayaba, diseñamos, desarrollamos y mejoramos constantemente
                una plataforma que centraliza la información clave de la
                infraestructura educativa, facilitando su seguimiento y gestión.
                Nos enfocamos en consolidar datos, generar informes útiles y
                promover herramientas confiables que respalden la toma de
                decisiones estratégicas, con el compromiso de abordar estos
                retos del sector educativo de forma efectiva y sostenible.
              </p>
            </div>
          </div>

          {/* Bloque Visión */}
          <div className="flex items-start space-x-6">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-[#034f00] mb-4">
                Nuestra Visión
              </h3>
              <p className="text-lg text-gray-700">
                Para 2027, Guayaba busca ser una opción confiable y accesible en
                Colombia para la gestión integral de infraestructura educativa,
                destacándose por su rigor en procesos como la consolidación de
                información clave, seguimiento del uso de espacios y
                planificación horaria. Buscamos superar las limitaciones
                actuales del sector mediante una solución innovadora que
                respalden la toma de decisiones, favoreciendo la eficiencia y
                sostenibilidad en la gestión educativa.
              </p>
            </div>
            <img
              src="/images/vision.png"
              alt="Visión"
              className="w-40 h-40 object-contain self-start fill-[#1f6032]"
            />
          </div>
        </div>
      </div>

      {/* Nueva Sección: Valores */}
      <div className="bg-[#E8F4E8] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-[#034f00] mb-8">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Innovación
              </h4>
              <p className="text-gray-600">
                Desarrollamos una solución tecnológicas avanzada que aborda las
                necesidades actuales del sector educativo, facilitando la
                modernización y sostenibilidad en la gestión de infraestructura.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Fiabilidad
              </h4>
              <p className="text-gray-600">
                Proporcionamos una plataforma estable, accesible y consistente
                que garantiza la disponibilidad de datos y herramientas clave
                para todos los roles de usuario.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Rigor
              </h4>
              <p className="text-gray-600">
                Aseguramos la precisión y calidad de la información, así como la
                transparencia en los procesos, proporcionando herramientas que
                minimicen errores y respalden decisiones informadas.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Sección: Nuestro Equipo */}
      <div className="bg-[#F9FAFB] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-[#034f00] mb-8">Equipo GUAYABA</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Miembro 1 */}
            <div className="flex-grow flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
              <img src="/images/tibusanti.jpg" alt="Miembro 1" className="w-32 h-32 rounded-full object-cover mb-4"/>
              <h4 className="text-lg font-semibold text-gray-800">Santiago Reyes Ochoa</h4>
              <p className="text-sm text-gray-600">Frontend + Backend</p>
                <div className="mt-2 flex space-x-2">
                  <a href="#" className="text-blue-500 hover:underline">LinkedIn</a>
                  <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                </div>
            </div>

          {/* Miembro 2 */}
            <div className="flex-grow flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
              <img src="/images/sant.jpg" alt="Miembro 2" className="w-32 h-32 rounded-full object-cover mb-4"/>
              <h4 className="text-lg font-semibold text-gray-800">Santiago Ballen Leguizamo</h4>
              <p className="text-sm text-gray-600">Backend</p>
                <div className="mt-2 flex space-x-2">
                  <a href="#" className="text-blue-500 hover:underline">LinkedIn</a>
                  <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                </div>
            </div>

          {/* Miembro 3 */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <img src="/images/miguel.jpg" alt="Miembro 3" className="w-32 h-32 rounded-full object-cover mb-4"/>
              <h4 className="text-lg font-semibold text-gray-800">Miguel Angel Suarez Cortes</h4>
              <p className="text-sm text-gray-600">Backend</p>
              <div className="mt-2 flex space-x-2">
                <a href="#" className="text-blue-500 hover:underline">LinkedIn</a>
                <a href="#" className="text-blue-500 hover:underline">GitHub</a>
              </div>
            </div>

          {/* Miembro 4 */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <img src="/images/dan3.jpg" alt="Miembro 4" className="w-32 h-32 rounded-full object-cover mb-4"/>
              <h4 className="text-lg font-semibold text-gray-800">Daniel Esteban Tobar Lozano</h4>
              <p className="text-sm text-gray-600">Frontend</p>
                <div className="mt-2 flex space-x-2">
                  <a href="#" className="text-blue-500 hover:underline">LinkedIn</a>
                  <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                </div>
            </div>
        </div>
      </div>
    </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
