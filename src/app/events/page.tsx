"use client"
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from 'react-modal';
import Navbar from "../components/navbar/page";


interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventClickArg | null;
  setEvents: Dispatch<SetStateAction<EventInput[]>>;
  isEditMode: boolean;
  onAddEvent: (title: string, start: string, end: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen, onClose, event, setEvents, isEditMode
}) => {
  const [token,setToken] = useState('')
  const [userId,setUserId] = useState('')
  
  const [editedTitle, setEditedTitle] = useState<string | undefined>(event?.event.title);
  const [editedStart, setEditedStart] = useState<string | undefined>(event?.event.start?.toISOString().slice(0, 16));
  const [editedEnd, setEditedEnd] = useState<string | undefined>(event?.event.end?.toISOString().slice(0, 16));

  useEffect(() => {
    setToken(localStorage.getItem('token'))
    setUserId(localStorage.getItem('id'))
    setEditedTitle(event?.event.title || "");
    setEditedStart(event?.event.start?.toISOString().slice(0, 16) || "");
    setEditedEnd(event?.event.end?.toISOString().slice(0, 16) || "");
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

  const handleAddEvent = async () => {
    try {
      if (!editedTitle || !editedStart || !editedEnd) {
        alert("All fields are required");
        return;
      }

      const res = await fetch(`http://localhost:8080/events/user/${userId}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          start: editedStart,
          end: editedEnd,
        }),
      });

      if (res.ok) {
        alert("Event added successfully");


        handleModalClose();
        window.location.reload();
      
        const updatedEvents = await res.json();
        setEvents(updatedEvents);

        
      } else if (res.status === 400) {
        alert("Overlapping events not allowed")
      } else {
        console.error("Failed to add event. Status:", res.status);
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEventEdit = async (eventId: string) => {
    try {
      if (!eventId || !editedTitle || !editedStart || !editedEnd) {
        alert("All fields are required");
        return;
      }

      console.log('Editing event with ID:', eventId);

      const res = await fetch(`http://localhost:8080/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          start: editedStart,
          end: editedEnd,
        }),
      });

      if (res.ok) {
        alert("Event edited successfully");

        setEvents((prevEvents) => prevEvents.filter((prevEvent) => prevEvent.id !== eventId));
        handleModalClose();
        window.location.reload();
      } 
      else if (res.status === 400) {
        alert("Overlapping events not allowed")
      }else {
        console.error("Failed to edit event. Status:", res.status);
      }
    } catch (error) {
      console.error("Error editing event:", error);
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        console.log("Event deleted successfully");

        setEvents((prevEvents) => prevEvents.filter((prevEvent) => prevEvent.id !== eventId));
        handleModalClose();
        window.location.reload();
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
       
          <div className="p-2">
            <label>Title:</label>
            <input
              className="border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
              type="text"
              value={editedTitle}
              onChange={handleTitleChange }
            />
            <label>Start:</label>
            <input
              className="border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
              type="datetime-local"
              value={ editedStart}
              onChange={ handleStartChange }
            />
            <label>End:</label>
            <input
              className="border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
              type="datetime-local"
              value={editedEnd}
              onChange={ handleEndChange}
            />
          </div>
        
        <div className="flex place-content-around">
        {isEditMode ?  (
        
            <button
              className="border-2 my-2 mx-3 border-red-500 focus:outline-none bg-white text-red-500 font-bold tracking-wider block w-full p-2 
            rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-white to-red-500"
              type="button"
              onClick={() =>  (event && handleEventDelete(event.event.id || ""))}
            >
              Delete
            </button>
          ) : (
            ""
          )}
          <button
            className="border-2 my-2 mx-3 border-[#0F2A50] focus:outline-none bg-[#0F2A50]
               text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]"
            type="button"
            onClick={() => isEditMode ? (event && handleEventEdit(event.event.id || "")) : (console.log('Before add event'), handleAddEvent())}       >
        {isEditMode ? 'Save' : 'Add'}
          </button>
        </div>
      </Modal>
    </div>
  );
};


const Events: React.FC = () => {
  const [token,setToken] = useState('')
  const [userId,setUserId] = useState('')
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

 

  const handleAddEventClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'))
    setUserId(localStorage.getItem('id'))
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