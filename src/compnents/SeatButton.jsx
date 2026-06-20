const SeatButton = ({ seat, selectSeats }) => {
    return <button
        key={seat._id}
        disabled={seat.status !== "available"}
        onClick={() => {
            if (seat.status === "available") {
                selectSeats(seat);
            }
        }}
        className={`
                h-12 w-12 rounded-lg text-white text-sm font-semibold
                transition-all duration-200 hover:scale-105

                ${seat.status === "booked"
                ? "bg-red-500"
                : seat.status === "reserved"
                    ? "bg-blue-500"
                    : "bg-green-500 hover:bg-green-400"
            }
              `}
    >
        {seat.seatNumber}
    </button>
}

export default SeatButton; 