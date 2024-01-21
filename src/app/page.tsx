"use client"
import { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from 'react-modal';
import Navbar from "./components/navbar/page";


interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventClickArg | null;
  setEvents: Dispatch<SetStateAction<EventInput[]>>;
}

// Componente da modal
const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, setEvents }) => {
  const { data: session } = useSession();
  const [editedTitle, setEditedTitle] = useState<string | undefined>(event?.event.title);
  const [editedStart, setEditedStart] = useState<string | undefined>(event?.event.start?.toISOString().slice(0, 16));
  const [editedEnd, setEditedEnd] = useState<string | undefined>(event?.event.end?.toISOString().slice(0, 16));


  const sessionRef = useRef<string | undefined>(session?.user?.accessToken);

  useEffect(() => {
    setEditedTitle(event?.event.title);
    setEditedStart(event?.event.start?.toISOString().slice(0, 16));
    setEditedEnd(event?.event.end?.toISOString().slice(0, 16));
  }, [event]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedStart(e.target.value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEnd(e.target.value);
  };


  const handleModalClose = () => {
    onClose();
  };


  const handleEventEdit = async (eventId: string) => {
    try {
      if (!eventId) {
        console.error("Event ID is undefined or null");
        return;
      }

      console.log('Editing event with ID:', eventId);

      const res = await fetch(`http://localhost:8080/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionRef.current}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          start: editedStart,
          end: editedEnd,
        }),
      });

      if (res.ok) {
        console.log("Event edited successfully");

        setEvents((prevEvents) => prevEvents.filter((prevEvent) => prevEvent.id !== eventId));
        handleModalClose();
      } else {
        console.error("Failed to delete event. Status:", res.status);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      if (!eventId) {
        console.error("Event ID is undefined or null");
        return;
      }

      console.log('Deleting event with ID:', eventId);

      const res = await fetch(`http://localhost:8080/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionRef.current}`,
        },
      });

      if (res.ok) {
        console.log("Event deleted successfully");

        setEvents((prevEvents) => prevEvents.filter((prevEvent) => prevEvent.id !== eventId));
        handleModalClose();
      } else {
        console.error("Failed to delete event. Status:", res.status);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };



  return (
    <div>
      <Modal
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            zIndex: 1001,
          },
        }}
        isOpen={isOpen}
        onRequestClose={handleModalClose}
      >
        <div className="flex flex-row justify-around">
          <h2 className="text-center text-xl py-2 text-[#0F2A50]">Detalhes do Evento</h2>

          <button
            className="border-2 rounded-full py-2 px-3  border-gray-100 focus:outline-none bg-gray-100 "
            onClick={handleModalClose}
          >
            X
          </button>
        </div>
        {event && (
          <div className="p-2">
            <label>Title:</label>
            <input
              className="border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
            />
            <label>Start:</label>
            <input
              className="border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
              type="datetime-local"
              value={editedStart}
              onChange={handleStartChange}
            />
            <label>End:</label>
            <input
              className="border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
              type="datetime-local"
              value={editedEnd}
              onChange={handleEndChange}
            />
          </div>
        )}
        <div className="flex place-content-around">
          <button
            className="border-2 my-2 mx-3 border-red-500 focus:outline-none bg-white text-red-500 font-bold tracking-wider block w-full p-2 
            rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-white to-red-500"
            type="button"
            onClick={() => event && handleEventDelete(event.event.id || "")}
          >
            Delete
          </button>
          <button
            className="border-2 my-2 mx-3 border-[#0F2A50] focus:outline-none bg-[#0F2A50]
    text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
            type="button"
            onClick={() => event && handleEventEdit(event.event.id || "")}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};


const HomePage: React.FC = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/user/1/events", {
          method: "GET",
          headers: {
            authorization: `Bearer ${session?.user.accessToken}`,
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
  }, [session]);

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
      {/* <Navbar /> */}

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

      <EventModal isOpen={modalOpen} onClose={closeModal} event={selectedEvent} setEvents={setEvents} />
    </main>
  );
};

export default HomePage;
