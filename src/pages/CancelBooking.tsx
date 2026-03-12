
import { useEffect, useState } from "react";



CancelBookingPage.route = {
    path: '/cancel-booking',
    menuLabel: 'Avboka',
    index: 9,
};

interface bookings {
    id: number;
    userId: number;
    bookingNumber: number;
    totalPrice: number;
    email: string;
    created: number;
    isAvailable: Boolean;
}


export default function CancelBookingPage() {

    const [bookingNumber, setBookingNumber] = useState("");
    const [booking, setBooking] = useState<bookings | null>(null);
    const [error, setError] = useState<string | null>(null);


    const getBooking = async () => {
        try {
            const res = await fetch(`/api/bookings/bnum/${bookingNumber}`);
            const data = await res.json();
            setBooking(data);
        } catch (error) {
            setError("Kunde inte hämta bokning");
        }
    };
    const canceltBooking = async () => {
        try {
            const res = await fetch(`/api/bookings/bnum/${bookingNumber}/cancel`, {
                method: "PUT"
            });
            const data = await res.json();
            setBooking(data);

        } catch (error) {
            setError("Kunde inte hämta bokning");
        }
    };

    return <>

        <div className="cancelbooking">
            <h1 className="cancelbooking-title">Avboka</h1>

            <p className="cancelbooking-label">Ange din bokningskod nedan för att avboka din bokning:</p>

            <input
                type="text"
                className="cancelbooking-input"
                placeholder="Bokningskod"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
            />

            <button
                className="cancelbooking-btn"
                onClick={getBooking}
            >
                Hämta Bokning
            </button>
            {error && <p className="error">{error}</p>}
            {booking && (
                <ul id="list">
                    <p>Email: {booking.email}</p>
                    <p>Bokningsnummer: {booking.bookingNumber}</p>
                    <p>Pris: {booking.totalPrice} kr</p>
                    <p>Skapad: {booking.created}</p>
                </ul>
            )}
            {booking && booking.isAvailable && (
                <button
                    className="cancelbooking-btn"
                    onClick={canceltBooking}
                >
                    Avboka Bokning
                </button>
            )}
        </div >
    </>
}