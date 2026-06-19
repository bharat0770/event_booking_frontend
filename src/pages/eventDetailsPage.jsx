import axios from "axios";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventDetails = () => {
    const [seatsList, setSeatsList] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservationInProg, setReservationInProg] = useState(false);
    const [reservationId, setReservationId] = useState(null);
    const selectSeats = (newSelect) => {
        setSelectedSeats((prev) => [...prev, newSelect])
        console.log("selecing ", newSelect)
        console.log("select", selectedSeats);
    }
    const { id } = useParams();
    const userId = localStorage.getItem("testUser");
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.post("http://localhost:3000/api/v1/seat/list/all", {
                    eventId: id
                });

                console.log("fetched seats data ")
                setSeatsList(res.data.data);
            } catch (error) {
                console.log("error while fetching seat", error);
            }
        }
        fetch();
    }, [])
    const reserveSeat = async () => {
        let seatsId = [];
        let seatNumbers = [];
        selectedSeats.map((i) => {
            seatNumbers.push(i.seatNumber);
            seatsId.push(i._id);
        })
        console.log(seatsId, seatNumbers)

        const res = await axios.post("http://localhost:3000/api/v1/reservation/create", {
            userId: userId,
            eventId: id,
            seatIds: [...seatsId],
            seatNumbers: [...seatNumbers]
        })
        console.log("reservation ", res);

        setReservationId(res.data.data[0]._id);
        // setReservationId(res.data.data._id);

        setReservationInProg(true)
    }
    const confimBooking = async () => {

        if (reservationId) {
            const bookingdetails = await axios.post("http://localhost:3000/api/v1/reservation/booking/confirm", {
                reservationId
            })
            console.log("booking det", bookingdetails);

            setReservationInProg(false);
            window.location.reload();
        }
        else {
            alert("reservation id not caught")
        }
    }
    return <>

        <div className="bg-gray-200 h-[90vh] flex flex-col justify-center items-center relative py-2">
            <div className="bg-gray-100 shadow-lg border-.5  min-h-[50%]  rounded-xl px-5 py-3 grid  grid-cols-10 m-auto gap-y-2 gap-x-4">
                {
                    seatsList.length && seatsList.map((seat, idx) => {
                        return <Seat seat={seat} idx={idx} selectSeats={selectSeats} />
                    })
                }
            </div>
            {
                selectedSeats.length > 0 &&
                <div>
                    <button className="bg-red-400 rounded-lg text-white text-2xl px-5 py-2 cursor-pointer" onClick={() => {
                        reserveSeat()
                    }}>
                        Book
                    </button>
                </div>

            }
            {
                reservationInProg && <ConfirmBooking selectedSeats={selectedSeats} confimBooking={confimBooking} />

            }
            {
                reservationInProg && <Overlay setReservationInProg={setReservationInProg} />
            }
        </div>

    </>

}
const Seat = ({ seat, idx, selectSeats }) => {
    return <div key={idx} className={`${seat.status == "booked" ? "bg-red-400" : seat.status == "reserved" ? "bg-blue-400" : "bg-green-400"}
                         rounded-xl w-10  py-2 text-center cursor-pointer `}
        onClick={() => { seat.status == "available" && selectSeats(seat) }}>
        <p className="text-white">{seat.seatNumber}</p>
    </div>
}

const Overlay = ({ setReservationInProg }) => {
    return <div onClick={() => setReservationInProg(false)} className="overlay z-50 bg-gray-700 h-screen w-screen fixed"> </div>
}


const ConfirmBooking = ({ selectedSeats, confimBooking }) => {
    return <div className="absolute z-100 bg-gray-200 w-80 h-96 flex flex-col justify-center items-center rounded-xl p-2">

        <h3 className="text-xl">confirm bookings</h3>
        <div className="h-4/5 w-full bg-gray-200  rounded-lg  grid grid-cols-5 grid-rows-4 py-4 gap-2">
            {
                selectedSeats?.map((seat, idx) => {
                    return <p className="text-center bg-white p-4 rounded-md" key={idx}>{seat.seatNumber} </p>
                })
            }
        </div>

        <div className="h-1/5 w-full flex justify-center items-center">
            <button
                className="bg-red-400 rounded-lg text-white text-2xl px-5 py-2 cursor-pointer"
                onClick={confimBooking}
            >
                Confirm
            </button>
        </div>

    </div>
}
export default EventDetails; 