import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ConfirmBookingPage = () => {
    const { reservationId, eventId } = useParams();
    const token = localStorage.getItem("testUser");
    if (!token) {
        navigate("/login")
    }
    const [eventDetail, setEventDetail] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardholderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
    });
    // const [reservationDetails, setReservationDetails] = useState(null); 
    const [timeLeft, setTimeLeft] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            try {
                const reservationResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reservation/detail`, { reservationId: reservationId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const eventDetailresponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/event/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setEventDetail(eventDetailresponse.data.data);
                // setReservationDetails(res.data.data); 
                const expiry = new Date(reservationResponse.data.data.expiresAt).getTime();
                setTimeLeft(Math.floor((expiry - Date.now()) / 1000));
            } catch (error) {
                toast.error(error.message);
            }
        }
        fetch();
    }, []);
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            window.history.pushState(null, "", window.location.href);
            alert("Booking in progress! Please complete payment before leaving.");
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const formatCardNumber = (value) =>
        value
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();

    const formatCVV = (value) => value.replace(/\D/g, "").slice(0, 4);
    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "cardNumber") value = formatCardNumber(value);
        if (name === "cvv") value = formatCVV(value);

        setCardDetails((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };
    const months = Array.from({ length: 12 }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 12 }, (_, i) =>
        String(currentYear + i).slice(-2)
    );

    const confirmBooking = async () => {
        if (
            cardDetails.cardholderName.length <= 0 ||
            cardDetails.cardNumber.length <= 0 ||
            cardDetails.expiryMonth.length <= 0 ||
            cardDetails.expiryYear.length <= 0 ||
            cardDetails.cvv.length <= 0
        ) {
            alert("please fill all the required fields");
            return
        }

        if (cardDetails.cardNumber !== "4242 4242 4242 4242") {

            // alert("enter correct card number");
            toast.error("Invalid Card Number");
            return;
        }

        if (reservationId) {
            const bookingdetails = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reservation/booking/confirm`, {
                reservationId
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            toast.success("booking successfull");
            // setReservationInProg(false);
            navigate("/")
            // window.location.reload();
            toast.success("Booking Successfull!")
        }
        else {
            alert("error while confirmation")
        }
    }

    return (
        <div className="min-h-screen bg-gray-100/30 px-4 py-12 lg:px-20 relative">
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Movie Section */}
                <div className="relative lg:flex-[1.4] min-h-[400px] lg:min-h-[750px] rounded-2xl overflow-hidden shadow-xl">
                    <img
                        // src="https://www.movieposters.com/cdn/shop/files/backtofuture.mpw.jpg?v=1762467212&width=1680"
                        src={eventDetail?.images[0] || "https://www.movieposters.com/cdn/shop/products/857805fc819baf858faad8cf6430be97_137b9671-5707-440b-ba63-e79dc6362497.jpg?v=1762500827&width=1680"}
                        // "https://www.movieposters.com/cdn/shop/products/857805fc819baf858faad8cf6430be97_137b9671-5707-440b-ba63-e79dc6362497.jpg?v=1762500827&width=1680"
                        alt={eventDetail?.name || "movie poster"}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <h1 className="text-3xl lg:text-6xl font-bold mb-2">
                            {eventDetail?.name}
                        </h1>

                        <p className="text-sm lg:text-lg text-gray-200 mb-3">
                            Adventure • Sci-Fi • Comedy
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                8.5/10
                            </span>

                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                116 min
                            </span>

                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="lg:flex-1 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 relative">
                    <div className="p-6 lg:p-8">

                        <h2 className="text-white text-2xl font-bold mb-2">
                            Complete Payment
                        </h2>

                        <p className="text-gray-400 text-sm mb-8">
                            Secure checkout for your movie tickets.
                        </p>

                        <div className="space-y-5">

                            {/* Cardholder Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                    Cardholder Name
                                </label>

                                <input
                                    type="text"
                                    name="cardholderName"
                                    value={cardDetails.cardholderName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className={`w-full bg-gray-900 text-white rounded-xl px-4 py-3 border outline-none transition
                ${errors.cardholderName
                                            ? "border-red-500"
                                            : "border-gray-700 focus:border-red-500"
                                        }`}
                                />

                                {errors.cardholderName && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.cardholderName}
                                    </p>
                                )}
                            </div>

                            {/* Card Number */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                    Card Number
                                </label>

                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={cardDetails.cardNumber}
                                    onChange={handleChange}
                                    placeholder="1234 5678 9012 3456"
                                    required={true}
                                    className={`w-full bg-gray-900 text-white rounded-xl px-4 py-3 border outline-none font-mono transition
                ${errors.cardNumber
                                            ? "border-red-500"
                                            : "border-gray-700 focus:border-red-500"
                                        }`}
                                />
                                <p className="text-white/50 text-lg">Try 4242 4242 4242 4242 for success others fail</p>
                                {errors.cardNumber && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.cardNumber}
                                    </p>
                                )}
                            </div>

                            {/* Expiry + CVV */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        Expiry
                                    </label>

                                    <div className="flex gap-2">
                                        <select
                                            name="expiryMonth"
                                            value={cardDetails.expiryMonth}
                                            onChange={handleChange}
                                            className="flex-1 bg-gray-900 text-white rounded-xl px-3 py-3 border border-gray-700 outline-none focus:border-red-500"
                                        >
                                            <option value="">MM</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            name="expiryYear"
                                            value={cardDetails.expiryYear}
                                            onChange={handleChange}
                                            className="flex-1 bg-gray-900 text-white rounded-xl px-3 py-3 border border-gray-700 outline-none focus:border-red-500"
                                        >
                                            <option value="">YY</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="w-28">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        CVV
                                    </label>

                                    <input
                                        type="password"
                                        name="cvv"
                                        value={cardDetails.cvv}
                                        onChange={handleChange}
                                        placeholder="123"
                                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 border border-gray-700 outline-none font-mono focus:border-red-500"
                                    />
                                </div>

                            </div>
                            {/* Payment Button */}
                            <button
                                onClick={() => { confirmBooking() }}
                                // disabled={loading || paymentStatus === "success"}
                                type="submit"
                                className="w-[90%] bg-red-600 hover:bg-red-500 transition text-white font-semibold rounded-xl py-4 absolute bottom-2 "
                            >
                                Pay
                            </button>

                        </div>
                    </div>
                </div>

            </div>
            <div className="absolute right-10 top-0 z-10  text-3xl">
                time {Math.floor(timeLeft / 60)} : {timeLeft % 60}
            </div>
        </div>
    );
};

export default ConfirmBookingPage;