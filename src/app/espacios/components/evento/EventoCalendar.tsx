"use client";

import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { Evento } from "../../../../types/api";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface EventoCalendarProps {
  eventos: Evento[];
  onEventoClick: (evento: Evento) => void;
}

export interface EventoCalendarRef {
  gotoDate: (date: string) => void;
}

const EventoCalendar = forwardRef<EventoCalendarRef, EventoCalendarProps>(({ eventos, onEventoClick }, ref) => {
  const calendarRef = useRef<FullCalendar>(null);

  useImperativeHandle(ref, () => ({
    gotoDate: (date: string) => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(date);
      }
    },
  }));

  const getRecurringEvents = (evento: Evento) => {
    if (!evento.días) return [evento];

    const daysMap: { [key: string]: number } = {
      L: 1, // Lunes
      M: 2, // Martes
      X: 3, // Miércoles
      J: 4, // Jueves
      V: 5, // Viernes
      S: 6, // Sábado
      D: 0, // Domingo
    };

    const startDate = new Date(evento.fecha_inicio);
    const endDate = new Date(evento.fecha_fin);
    const recurringEvents = [];

    // Iterar día por día dentro del rango de fechas
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const currentDay = currentDate.getDay(); // 0 (Domingo) - 6 (Sábado)

      const dayLetter = Object.keys(daysMap).find(
        (key) => daysMap[key] === currentDay
      );

      // Si el día actual está en los días seleccionados (ej: "L" o "V")
      if (dayLetter && evento.días.includes(dayLetter)) {
        const eventStart = new Date(currentDate);
        eventStart.setHours(
          parseInt(evento.hora_inicio.split(":")[0]),
          parseInt(evento.hora_inicio.split(":")[1]),
          0
        );

        const eventEnd = new Date(currentDate);
        eventEnd.setHours(
          parseInt(evento.hora_fin.split(":")[0]),
          parseInt(evento.hora_fin.split(":")[1]),
          0
        );

        recurringEvents.push({
          ...evento,
          unique_id: `${evento.id_evento}-${eventStart.toISOString()}`, // Generar un ID único
          fecha_inicio: eventStart.toISOString(),
          fecha_fin: eventEnd.toISOString(),
        });
      }
    }

    return recurringEvents;
  };

  const eventsForCalendar = useMemo(() => {
    const events = eventos.flatMap(getRecurringEvents).map((evento) => ({
      id: evento.unique_id || evento.id_evento.toString(),
      title: evento.nombre || "Sin título",
      start: `${evento.fecha_inicio.split("T")[0]}T${evento.hora_inicio}`,
      end: `${evento.fecha_fin.split("T")[0]}T${evento.hora_fin}`,
      extendedProps: {
        descripcion: evento.descripcion,
        tipo: evento.tipo,
        días: evento.días,
        id_espacio: evento.id_espacio,
        id_evento: evento.id_evento, // Mantener el ID original del evento
      },
    }));
    return events;
  }, [eventos]);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }}
      events={eventsForCalendar}
      eventClick={(info) => {
        const eventoId = info.event.extendedProps.id_evento.toString();
        const evento = eventos.find((e) => e.id_evento.toString() === eventoId);
        if (evento) {
          console.log("Detalles del evento original:", evento);
          onEventoClick(evento);
        }
      }}
      height="auto" // Ajustar altura automáticamente
      contentHeight="auto"
      aspectRatio={2} // Relación de aspecto para el calendario
      nowIndicator // Mostrar indicador de la hora actual
      slotDuration="01:00:00" // Duración de cada intervalo de tiempo
      slotLabelInterval="01:00:00" // Intervalo de las etiquetas de tiempo
      allDaySlot={false} // Ocultar la sección de "todo el día"
      eventClassNames="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-1 cursor-pointer" // Estilos para los eventos
      dayHeaderClassNames="bg-gray-100 font-bold p-2" // Estilos para los encabezados de los días
    />
  );
});

export default EventoCalendar;