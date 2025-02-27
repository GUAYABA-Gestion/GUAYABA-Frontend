"use client";
import { useState } from "react";
import { Log } from "../../../types/api";
import AuditTable from "./AuditTable";
import AuditDetailsModal from "./AuditDetailsModal";

interface AuditManagerProps {
  logs: Log[];
}

const AuditManager: React.FC<AuditManagerProps> = ({ logs }) => {
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
    <div className="flex-grow">
      <AuditTable
        logs={logs}
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