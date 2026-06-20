import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import EventListComponent from "../compnents/EventListComponent";
import toast from "react-hot-toast";

// const EventListComponent = ({ event, idx, navigate }) => {
//   const formattedDate = new Date(event.eventDateTime).toLocaleDateString();
//   return <div className="bg-gray-50 border-1 border-red-200 shadow-md rounded-xl p-3 cursor-pointer hover:bg-gray-100/30" key={idx} onClick={() => {
//     navigate(`/event/${event._id}`)
//   }}>
//     <p className="text-xl">{event.name}</p>
//     <p className="text-gray-600">{event.venue}</p>
//     <p>{formattedDate}</p>
//     <p className="text-gray-800">seats : {event.totalSeats}</p>
//   </div>
// }


const EventListPage = () => {
  const [eventList, setEventList] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("testUser");
  if (!token) {
    navigate("/login")
  }
  useEffect(() => {
    if (!localStorage.getItem("testUser")) {
      window.location.href = "/login"
    }
    const fetchdata = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/event/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     
        setEventList(res.data.data);
      } catch (error) {
      toast.error(error.message || "something went wrong"); 
      }
    }
    fetchdata();
  }, [])


  return (
    <>
      <div className="md:px-20 xl:px-40 bg-gray-100/70  py-2  min-h-screen w-screen  ">
        <h1>Event List</h1>
        <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {
            eventList.length > 0 && eventList.map((event, idx) => {
              return <EventListComponent event={event} idx={event._id} navigate={navigate} />
            })
          }
        </div>
      </div>
    </>
  )
}
export default EventListPage; 