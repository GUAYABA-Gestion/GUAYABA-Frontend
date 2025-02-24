"use client";
import { useEffect, useRef, useState } from "react";
import { Sede, Espacio, Edificio } from "../../../types/api";
import { fetchEventosByEspacios } from "../../api/EventoActions";
import { fetchEspaciosByEdificios } from "../../api/EspacioActions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSedes: number[];
  filteredEdificios: Edificio[];
  rolSimulado: string; // Añadir el rol simulado
}

interface EdificioUsage {
  nombre: string;
  usage: number;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  selectedSedes,
  filteredEdificios,
  rolSimulado,
}) => {
  const handleGenerateReport = () => {
    // Almacenar los datos en localStorage
    localStorage.setItem("informeData", JSON.stringify({
      selectedSedes,
      filteredEdificios,
      rolSimulado,
    }));

    // Redirigir a la página de informe
    window.location.href = "/infraestructura/informe";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Detalles del Informe</h2>
        <p className="mb-4">
          Aquí puedes generar un informe detallado de las sedes seleccionadas.
        </p>
        <button
          onClick={handleGenerateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generar Informe
        </button>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DetailsModal;