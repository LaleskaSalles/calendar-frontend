import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Navbar from "../navbar/page";


export default function Events() {
    return (
        <div>
            <Navbar />
            <div className="w-full h-full mt-3 px-3">
                <div>
                    <button className="my-2 border-none bg-[#0F2A50]
                            text-white py-2 px-4 rounded-lg hover:bg-gradient-to-r from-[#0F2A50] to-[#4F86C6]">
                        Add Event
                    </button>
                </div>
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
                    nowIndicator={true}
                    editable={true}
                    droppable={false}
                    selectable={true}
                    selectMirror={true}
                //   dateClick={}

                />
            </div>
        </div>
    )
}
