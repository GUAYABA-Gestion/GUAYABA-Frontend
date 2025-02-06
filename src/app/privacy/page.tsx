"use client";
import { useState, useEffect } from "react";
import { Header, Footer } from "../../../components";

export default function PrivacyPolicy() {
  return (
    <div>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          POLÍTICA DE PRIVACIDAD
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <p className="text-justify text-gray-700">
            Bienvenido/a a Guayaba ("nosotros", "nuestro", "la empresa"). 
            Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal de los usuarios ("tú", "usuario") 
            cuando acceden y utilizan nuestro sitio web y nuestros servicios.
          </p>
        </div>

        {/* 1 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">1. Responsable del Tratamiento</h2>
          <div className="text-justify text-gray-700">
            <strong>Santiago Reyes Ochoa</strong> (CC 1025460191), con domicilio en Calle 75 # 92-30, Bogotá, 
            es el responsable del tratamiento de sus datos personales. Contacto: guayabagestion@gmail.com.
          </div>
        </div>

        {/* 2 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6 w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">2. Datos que Recopilamos</h2>
          <div className="text-justify text-gray-700">
            Recopilamos información cuando usted:
          </div>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            <li className="mb-2">
              <strong>Inicia sesión con Google:</strong> Nombre, correo electrónico y foto de perfil.
            </li>
            <li className="mb-2">
              <strong>Usa nuestro sitio:</strong> Cookies técnicas (JWT) para gestionar su sesión.
            </li>
            <li>
              <strong>Interactúa con formularios:</strong> Datos de contacto si nos escribe.
            </li>
          </ul>
        </div>

        {/* 3 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">3. Cookies</h2>
          <div className="text-justify text-gray-700">
            Usamos cookies esenciales:
          </div>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            <li className="mb-2">
              <strong>session_jwt:</strong> Cookie técnica para mantener su sesión activa de forma segura. 
              Duración: Hasta que cierre el navegador.
            </li>
          </ul>
          <div className="mt-4 text-justify text-gray-700">
            Puede bloquearlas desde su navegador, pero el sitio no funcionará correctamente.
          </div>
        </div>

        {/* 4  */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6 w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">4. Finalidad del Tratamiento</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li className="mb-2">Autenticar su identidad mediante Google Sign-In.</li>
            <li className="mb-2">Brindar acceso seguro a su cuenta (cookie JWT).</li>
            <li>Responder consultas y mejorar nuestros servicios.</li>
          </ul>
        </div>

        {/* 5 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">5. Compartición de Información</h2>
          <p className="text-justify text-gray-700">
            No vendemos ni compartimos datos personales con terceros, salvo en los siguientes casos:<br />
            - Con <strong>Google</strong>, para la autenticación mediante OAuth.<br />
            - Cuando sea requerido por ley o autoridades competentes.<br />
          </p>
        </div>

        {/* 6 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">6. Seguridad y Almacenamiento de Datos</h2>
          <p className="text-justify text-gray-700">
            Implementamos medidas técnicas y organizativas para proteger los datos personales de accesos no autorizados, alteración o pérdida.
          </p>
        </div>

        {/* 7 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6 w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">7. Derechos del Usuario</h2>
          <p className="text-justify text-gray-700">
            Como usuario, tienes derecho a:<br />
            - Acceder, rectificar o eliminar tu información personal.<br />
            - Revocar el consentimiento para el uso de tus datos.<br />
            - Solicitar información sobre el tratamiento de tus datos.<br />
            Para ejercer estos derechos, contáctanos en: guayabagestion@gmail.com.
          </p>
        </div>

        {/* 8 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">8. Cambios en esta Política</h2>
          <p className="text-justify text-gray-700">
            Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio será notificado a través de nuestro sitio web.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
