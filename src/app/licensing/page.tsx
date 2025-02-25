"use client";

import Wompi from './components/wompi'; 
import { Header, Footer } from '../../../components';

export default function WompiPage() {
  console.log(process.env.NEXT_PUBLIC_WOMPI_PUBKEY)
  return (
<div className="min-h-screen flex flex-col"> {/* Contenedor principal */}
  <Header />
  
  <div className="bg-[#E8F4E8] py-16"> {/* Fondo verde claro */}
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white shadow-md rounded"> 
      
      {/* Sección de Servicios */}
      <div className="md:col-span-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nuestros Servicios</h2>
        <ul className="space-y-4">
          <li className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">60 horas de servicio por 1 mes</h3>
            <p className="text-gray-700">Incluye 60 horas de acceso y soporte durante un mes.</p>
            <p className="text-gray-900 font-bold mt-2">Precio: $2,000,000 COP</p>
          </li>
          <li className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Subscripción a la plataforma</h3>
            <p className="text-gray-700">Acceso completo a todas las funcionalidades de la plataforma por un mes.</p>
            <p className="text-gray-900 font-bold mt-2">Precio: $5,000,000 COP</p>
          </li>
          <li className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Licenciamiento de la plataforma</h3>
            <p className="text-gray-700">Licencia completa de uso de la plataforma para tu empresa.</p>
            <p className="text-gray-900 font-bold mt-2">Precio: $20,000,000 COP</p>
          </li>
        </ul>
      </div>

      {/* Sección de Pago con Wompi (más ancha) */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pago con Wompi</h2>
        <Wompi />
      </div>

    </div>
  </div>

  <Footer />
</div>


  );
}