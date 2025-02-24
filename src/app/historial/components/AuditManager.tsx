"use client";
import { useState } from "react";
import { Log, User } from "../../../types/api";
import AuditTable from "./AuditTable";
import AuditDetailsModal from "./AuditDetailsModal";

interface AuditManagerProps {
  logs: Log[];
  users: User[]; // Nueva propiedad para los usuarios
}

const AuditManager: React.FC<AuditManagerProps> = ({ logs, users }) => {
  const [filters, setFilters] = useState({
    fecha: "",
    operacion: "",
    tabla: "",
    horaInicio: "0",
    horaFin: "24",
    correo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const handleDetailsClick = (log: Log) => {
    setSelectedLog(log);
  };

  const handleCloseDetails = () => {
    setSelectedLog(null);
  };

  const resetFilters = () => {
    setFilters({
      fecha: "",
      operacion: "",
      tabla: "",
      horaInicio: "0",
      horaFin: "24",
      correo: "",
    });
    setCurrentPage(1); // Reset pagination to the first page
  };

  return (
    <div className="flex-grow mt-4 p-4">
      <h1 className="text-2xl font-bold text-[#034f00]">Historial de Cambios</h1>

      <AuditTable
        logs={logs}
        users={users} // Pasar los usuarios al componente AuditTable
        filters={filters}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onFilterChange={handleFilterChange}
        onDetailsClick={handleDetailsClick}
        resetFilters={resetFilters}
      />

      {selectedLog && (
        <AuditDetailsModal
          log={selectedLog}
          isOpen={!!selectedLog}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default AuditManager;