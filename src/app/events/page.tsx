"use client"
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Navbar from "../components/navbar/page";
import 'react-toastify/dist/ReactToastify.css';
import EventModal from "./EventModal";

const Events: React.FC = () => {
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleAddEventClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    setUserId(localStorage.getItem('id') || '')
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:8080/user/${userId}/events`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const eventData = await res.json();
          setEvents(eventData);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token, userId]);

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent(info);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };


  return (
    <main>
      <Navbar />

      <div className="w-full h-full mt-3 px-3 ">
        <div className="justify-end flex">
          <button className="my-2 border-none bg-[#0F2A50]
                            text-white py-2 px-4 rounded-lg hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
            onClick={handleAddEventClick}
          >
            Add Event
          </button>
        </div>
        {/* Calendário */}
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={750}
          nowIndicator={false}
          editable={false}
          droppable={false}
          selectable={false}
          selectMirror={false}
          events={events}
          eventClick={(info) => handleEventClick(info)}
        />

        <EventModal
          isOpen={modalOpen}
          onClose={closeModal}
          event={selectedEvent}
          setEvents={setEvents}
          isEditMode={selectedEvent !== null}
          onAddEvent={handleAddEventClick}
        />
      </div>
    </main>

  );
};

export default Events;