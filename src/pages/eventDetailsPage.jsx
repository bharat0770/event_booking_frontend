import axios from "axios";
import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SeatButton from "../compnents/SeatButton";
import toast from "react-hot-toast";




const EventDetails = () => {
    const [seatsList, setSeatsList] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservationInProg, setReservationInProg] = useState(false);
    const [reservationId, setReservationId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const { id } = useParams();
    const userId = localStorage.getItem("testUser");
    const navigate = useNavigate();
    const token = localStorage.getItem("testUser");
    if (!token) {
        navigate("/login")
    }
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seat/list/all`, {
                    eventId: id
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

            
                setSeatsList(res.data.data);
            } catch (error) {
                toast.error(error.message || "something went wrong"); 
            }
        }
        fetch();
    }, []);
    useEffect(() => {
        if (!reservationInProg) return;
        if (timeLeft <= 0) {
            alert("reservation time out");
            return
        };
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
   
        return () => clearInterval(timer);
    }, [reservationInProg, timeLeft]);

    const selectSeats = (newSelect) => {
        let oldSeats = selectedSeats;
        let filteredSeats = oldSeats.filter((seat, idx) => newSelect._id !== seat._id);
        if (filteredSeats.length !== oldSeats.length) {
            setSelectedSeats((prev) => [...filteredSeats])
        } else {
            setSelectedSeats((prev) => [...prev, newSelect])
        }
      
    }

    const reserveSeat = async () => {
        let seatsId = [];
        let seatNumbers = [];
        selectedSeats.map((i) => {
            seatNumbers.push(i.seatNumber);
            seatsId.push(i._id);
        })
  
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reservation/create`, {
            userId: userId,
            eventId: id,
            seatIds: [...seatsId],
            seatNumbers: [...seatNumbers]
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        setReservationId(res.data.data[0]._id);
   
        const expiry = new Date(res.data.data[0].expiresAt).getTime();
        setTimeLeft(Math.floor((expiry - Date.now()) / 1000));
        // setTimer(Math.floor((expiry - Date.now()) / 1000));
        // setReservationId(res.data.data._id);
        setReservationInProg(true)
    }

    const confimBooking = async () => {
        navigate(`/booking/confirm/${reservationId}/${id}`);
    }
    const handleOverlayClick = () => {
        alert("you are exiting, reservation will be halted");
        setReservationInProg(false);
        window.location.reload();
    }
    return <>
        <div className="min-h-screen bg-gray-100 px-4 py-8 relative">

            {/* Screen */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="bg-gray-900 text-white text-center py-4 rounded-t-full text-xl font-bold shadow-lg">
                    SCREEN
                </div>

                <div className="h-4 bg-gray-300 rounded-b-full shadow-inner"></div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-green-500"></div>
                    <span>Available</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-500"></div>
                    <span>Reserved</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-red-500"></div>
                    <span>Booked</span>
                </div>
            </div>

            {/* Seats */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-8">

                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">

                    {seatsList?.map((seat) => (
                        <SeatButton seat={seat} key={seat._id} selectSeats={selectSeats} />
                    ))}

                </div>
            </div>

            {/* Selected Seats + Reserve Button */}
            {selectedSeats.length > 0 && (
                <div className="max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-5">

                    <h2 className="text-xl font-semibold mb-4">
                        Selected Seats
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-5">
                        {selectedSeats.map((seat) => (
                            <span
                                key={seat._id}
                                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium"
                            >
                                {seat.seatNumber}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={reserveSeat}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Reserve Seats
                    </button>
                </div>
            )}

            {/* Booking Modal */}
            {reservationInProg && (
                <>
                    {/* Overlay */}
                    <div
                        onClick={handleOverlayClick}
                        className="fixed inset-0 bg-black/60 z-40"
                    />

                    {/* Modal */}
                    <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6">

                        <h2 className="text-2xl font-bold mb-4">
                            Confirm Booking
                        </h2>

                        <p className="text-gray-500 mb-4">
                            Please review your selected seats.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedSeats.map((seat) => (
                                <span
                                    key={seat._id}
                                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium"
                                >
                                    {seat.seatNumber}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={confimBooking}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Confirm Booking
                        </button>

                    </div>
                </>
            )}

            {reservationInProg && <div className="absolute right-10 top-0 z-50 text-white text-xl">
                time {Math.floor(timeLeft / 60)} : {timeLeft % 60}
            </div>}
        </div>

    </>

}


export default EventDetails;





