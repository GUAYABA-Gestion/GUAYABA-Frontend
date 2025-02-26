"use client";
import { Header } from "../../components";
import { Footer } from "../../components";
import { FuncionalidadesCarousel } from "../../components";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row bg-gray-50 overflow-hidden items-center justify-center w-full">{/* Sección izquierda: Texto */}
        <div className="flex-1 p-6 text-center md:text-left flex items-center justify-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Bienvenido a Guayaba
            </h2>
            <p className="mt-4 text-gray-600">
              Centralizamos la información clave de la estructura educativa de
              tu universidad, facilitando la gestión y toma de decisiones
              respecto a los distintos espacios que la componen, para que los
              puedas disfrutar al máximo. Creemos en la innovación y la
              fiabilidad.
            </p>
            {/* Botones */}
            <div className="mt-6 flex justify-center space-x-4">
              
              <a href="/licensing" className="bg-[#80BA7F] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300">
                Consulta Nuestros Planes
              </a>
            </div>
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
              Con Guayaba mejoramos, diseñamos y desarrollamos constantemente una plataforma que centraliza información clave de infraestructura educativa, 
              facilitando su seguimiento y gestión. Brindamos herramientas confiables que respaldan la toma de decisiones estratégicas;
              como la generación de informes y la planificación de horarios, para que las instituciones educativas puedan optimizar el uso de sus espacios y recursos.
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
              Para 2027, Guayaba busca ser una opción confiable y accesible en Colombia para la gestión integral de infraestructura educativa, 
              destacándose su seguridad y funcionalidades innovadoras, ayudando al sector educativo a mejorar la toma de decisiones administrativas, 
              favoreciendo la eficiencia y sostenibilidad en la gestión educativa realizada.
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
                Desarrollamos una solución tecnológica avanzada que aborda
                necesidades actuales del sector educativo: la
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
          <h3 className="text-2xl font-bold text-[#034f00] mb-8">
            Equipo GUAYABA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Miembro 1 */}
            <div className="flex-grow flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
              <img
                src="/images/tibusanti.jpg"
                alt="Miembro 1"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                Santiago Reyes Ochoa
              </h4>
              <div className="mt-2 flex space-x-2">
                <a href="https://github.com/Sreyeso" target="_blank" className="text-blue-500 hover:underline">
                  GitHub
                </a>
              </div>
            </div>

            {/* Miembro 2 */}
            <div className="flex-grow flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
              <img
                src="/images/sant.jpg"
                alt="Miembro 2"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                Santiago Ballen Leguizamo
              </h4>
              <div className="mt-2 flex space-x-2">
                <a href="https://github.com/SantBl18" target="_blank" className="text-blue-500 hover:underline">
                  GitHub
                </a>
              </div>
            </div>

            {/* Miembro 3 */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <img
                src="/images/miguel.jpg"
                alt="Miembro 3"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                Miguel Angel Suarez Cortes
              </h4>
              <div className="mt-2 flex space-x-2">
                <a href="https://github.com/miasuarezco" target="_blank" className="text-blue-500 hover:underline">
                  GitHub
                </a>
              </div>
            </div>

            {/* Miembro 4 */}
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <img
                src="/images/dan3.jpg"
                alt="Miembro 4"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                Daniel Esteban Tobar Lozano
              </h4>
              <div className="mt-2 flex space-x-2">
                <a href="https://github.com/dtobarl" target="_blank" className="text-blue-500 hover:underline">
                  GitHub
                </a>
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
