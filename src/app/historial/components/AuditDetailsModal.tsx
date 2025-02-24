"use client";
import React from "react";
import { Log } from "../../../types/api";

interface AuditDetailsModalProps {
  log: Log;
  isOpen: boolean;
  onClose: () => void;
}

const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({ log, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getDifferences = (oldData: any, newData: any) => {
    const differences: { [key: string]: { old: any; new: any } } = {};
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    allKeys.forEach((key) => {
      const oldValue = oldData ? oldData[key] : undefined;
      const newValue = newData ? newData[key] : undefined;
      differences[key] = { old: oldValue, new: newValue };
    });

    return differences;
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return <i>VACIO</i>;
    if (typeof value === "boolean") return value ? "VERDADERO" : "FALSO";
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
  };

  const differences = getDifferences(log.datos_anteriores, log.datos_nuevos);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Detalles del Cambio</h2>
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#80BA7F] text-white">
                <th className="border border-gray-300 px-4 py-2">Campo</th>
                <th className="border border-gray-300 px-4 py-2">Antiguo</th>
                <th className="border border-gray-300 px-4 py-2">Nuevo</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(differences).map(([key, value], index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                  <td className="border border-gray-300 p-2 text-black text-sm">{key}</td>
                  <td className={`border border-gray-300 p-2 text-black text-sm ${value.old !== value.new ? "bg-red-100" : ""}`}>
                    {formatValue(value.old)}
                  </td>
                  <td className={`border border-gray-300 p-2 text-black text-sm ${value.old !== value.new ? "bg-green-100" : ""}`}>
                    {formatValue(value.new)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsModal;