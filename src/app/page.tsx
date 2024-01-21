'use client'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar/page";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";


const HomePage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState();
  const fetchPost = async () => {
    const res = await fetch("http://localhost:8000/test/user/${session?.user.id}", {
      method: "Get",
      headers: {
        authorization: `bearer ${session?.user.accessToken}`,
      },
    });

    const response = await res.json();
    setPosts(response);
  };

  return (
    <main>
      <Navbar/>
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
    </main>
  );
}
export default HomePage;