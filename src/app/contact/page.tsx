"use client";

import { useState } from "react";
import { Header } from "../../../components";
import { validateCorreo } from "../api/auth/validation";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateCorreo(formData.email)) {
        setStatus("Correo electrónico no válido.");
        return;
      }
  
      setStatus("Enviando...");
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          setStatus("Mensaje enviado correctamente.");
          setFormData({ name: "", email: "", message: "" });
        } else {
          setStatus("Error al enviar el mensaje.");
        }
      } catch (error) {
        setStatus("Error de conexión.");
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Contenedor principal */}
        <div className="flex flex-col items-center justify-center w-full p-6 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800">Contáctanos</h2>
            <p className="mt-4 text-gray-600">¿Tienes alguna pregunta o sugerencia? Déjanos un mensaje y te responderemos lo antes posible.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white text-gray-900"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white text-gray-900"
                required
              />
              <textarea
                name="message"
                placeholder="Tu mensaje"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white text-gray-900 h-32"
                required
              />
              <button type="submit" className="w-full bg-[#80BA7F] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300">
                Enviar
              </button>
              {status && <p className="text-center text-gray-700 mt-2">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }
  