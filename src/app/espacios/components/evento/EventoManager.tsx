"use client";

import { useState, useEffect, useRef } from "react";
import { fetchEventosByEspacios } from "../../../api/EventoActions";
import { fetchProgramas } from "../../../api/UtilsActions";
import { Evento, Espacio, Programa } from "../../../../types/api";
import EventoCalendar, { EventoCalendarRef } from "./EventoCalendar";
import EventoTable from "./EventoTable";
import EventoDetailsModal from "./EventoDetailsModal";
import AddEventoModal from "./AddEventoModal";

interface EventoManagerProps {
  espacio: Espacio;
  rol: string;
}

const EventoManager: React.FC<EventoManagerProps> = ({ espacio, rol }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [isAddEventoModalOpen, setIsAddEventoModalOpen] = useState(false);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const calendarRef = useRef<EventoCalendarRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventosData = await fetchEventosByEspacios([espacio.id_espacio]);
        setEventos(eventosData);
      } catch (error: any) {
        setError(`❌ Error al cargar los datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [espacio.id_espacio]);

  useEffect(() => {
    const fetchProgramasData = async () => {
      try {
        const programasData = await fetchProgramas();
        // Organizar la lista de programas por ID
        programasData.sort((a: Programa, b: Programa) => a.id_programa - b.id_programa);
        setProgramas(programasData);
      } catch (error: any) {
        console.error("Error al obtener programas:", error);
      }
    };

    fetchProgramasData();
  }, []);

  const handleEventoClick = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsEventoModalOpen(true);
  };

  const handleAddEvento = (newEventos: Evento[]) => {
    setEventos([...eventos, ...newEventos]);
  };

  const handleSaveEvento = (updatedEvento: Evento) => {
    const updatedEventos = eventos.map((evento) =>
      evento.id_evento === updatedEvento.id_evento ? updatedEvento : evento
    );
    setEventos(updatedEventos);
    setSelectedEvento(updatedEvento);
  };

  const handleDeleteEvento = (id_evento: number) => {
    const updatedEventos = eventos.filter(
      (evento) => evento.id_evento !== id_evento
    );
    setEventos(updatedEventos);
    setSelectedEvento(null);
  };

  const handleAddEventoClick = () => {
    setIsAddEventoModalOpen(true);
  };

  const handleVerEventoClick = (evento: Evento) => {
    if (calendarRef.current) {
      calendarRef.current.gotoDate(evento.fecha_inicio);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-black">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <EventoTable
        eventos={eventos}
        programas={programas}
        onEventoClick={handleEventoClick}
        onVerEventoClick={handleVerEventoClick}
        onAddEventoClick={handleAddEventoClick}
        rol={rol}
      />

      <div className="bg-white rounded-lg shadow-md p-4">
        <EventoCalendar
          ref={calendarRef}
          eventos={eventos}
          onEventoClick={handleEventoClick}
        />
      </div>

      {(rol === "admin" || rol === "coord") && (
        <button
          onClick={handleAddEventoClick}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Añadir Evento
        </button>
      )}

      <EventoDetailsModal
        evento={selectedEvento}
        isOpen={isEventoModalOpen}
        onClose={() => setIsEventoModalOpen(false)}
        onSave={handleSaveEvento}
        onDelete={handleDeleteEvento}
        programas={programas}
        rol={rol}
      />
      <AddEventoModal
        isOpen={isAddEventoModalOpen}
        onClose={() => setIsAddEventoModalOpen(false)}
        onEventosAdded={handleAddEvento}
        programas={programas}
        idEspacio={espacio.id_espacio}
      />
    </div>
  );
};

export default EventoManager;