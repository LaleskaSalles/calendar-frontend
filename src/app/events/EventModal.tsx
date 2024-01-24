"use client"
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  const [editedTitle, setEditedTitle] = useState<string | undefined>(event?.event.title);
  const [editedStart, setEditedStart] = useState<string | undefined>(event?.event.start?.toISOString().slice(0, 16));
  const [editedEnd, setEditedEnd] = useState<string | undefined>(event?.event.end?.toISOString().slice(0, 16));

  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    setUserId(localStorage.getItem('id') || '')
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
        toast.warning("All fields are required", {
          position: 'top-right',
          autoClose: 2000,
        });
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
        toast.success('Event added successfully', {
          position: 'top-right',
          autoClose: 2000,
          onClose: () => window.location.reload(),
        });

        handleModalClose();

        const updatedEvents = await res.json();
        setEvents(updatedEvents);

      } else if (res.status === 400) {
        toast.warning("Overlapping events not allowed"), {
          position: 'top-right',
          autoClose: 2000,
        }
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
        toast.warning("All fields are required", {
          position: 'top-right',
          autoClose: 2000
          ,
        });
        return;
      }

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
        toast.success("Event edited successfully", {
          position: 'top-right',
          autoClose: 2000
          ,
          onClose: () => window.location.reload(),
        })

        setEvents((prevEvents) => prevEvents.filter((prevEvent) => prevEvent.id !== eventId));
        handleModalClose();


      }
      else if (res.status === 400) {
        toast.warning("Overlapping events not allowed"), {
          position: 'top-right',
          autoClose: 2000
          ,
        }
      } else {
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

      const res = await fetch(`http://localhost:8080/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {

        toast.success("Event deleted successfully", {
          position: 'top-right',
          autoClose: 2000
          ,
          onClose: () => window.location.reload(),
        })

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

        <div className="flex place-content-around">
          {isEditMode ? (

            <button
              className="border-2 my-2 mx-3 border-red-500 focus:outline-none bg-white text-red-500 font-bold tracking-wider block w-full p-2 
              rounded-lg focus:border-gray-700 hover:bg-gradient-to-r from-white to-red-500"
              type="button"
              onClick={() => (event && handleEventDelete(event.event.id || ""))}
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
            onClick={() => isEditMode ? (event && handleEventEdit(event.event.id || "")) : (handleAddEvent())}
          >
            {isEditMode ? 'Save' : 'Add'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EventModal;