import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

interface Booking {
  id: number;
  bookingNumber: string;
  totalPrice: number;
  screeningId: number;
}

interface Movie {
  Title: string; 
  cover: string;
}

interface Screening {
  id: number;
  startTime: string;
  movieId: number;
}

BookingConfirmation.route = {
  path: '/bookingconfirmation/:id',
  label: "Bekräftelse",
  index: 10
};

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string; }>();
  const location = useLocation();
  const { selectedSeats } = location.state || {selectedSeats: [], selectedDate: ""};

  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [screeningDate, setScreeningDate] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsPending(true);

    fetch(`/api/bookings/${id}`)
      .then(res => {
        if (!res.ok) throw Error('Kunde inte hämta bokningen.');
        return res.json();
      })
      .then(bookingData => {
        setBooking(bookingData);
        return fetch(`/api/screenings/${bookingData.screeningId}`);
      })
      .then(res => {
        if (!res.ok) throw Error('Kunde inte hämta visningsinformation.');
        return res.json();
      })
      .then((screeningData: Screening) => {
        setScreeningDate(screeningData.startTime.split('T')[0]);
        return fetch(`/api/movies/${screeningData.movieId}`);
      })
      .then(res => {
        if (!res.ok) throw Error('Kunde inte hämta filminformation.');
        return res.json();
      })
      .then(movieData => {
        setMovie(movieData);
        setIsPending(false);
      })
      .catch(err => {
        console.error("Fel vid laddning:", err);
        setError(err.message);
        setIsPending(false);
      });
  }, [id]);

  if (isPending) return <div className="c-section"><h2 className="loading-text">Laddar bekräftelse...</h2></div>;
  if (error) return <div className="c-section"><div className="error-msg">{error}</div></div>;

  return (
    <div className="c-section">
      <div className="image-container">
          <img className="c-img" src="/images/biocover.jpg" alt="Picture of a cinema" />
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" className="qr-code" viewBox="0 0 16 16">
        <path d="M2 2h2v2H2z" /><path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" /><path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" /><path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" /><path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
      </svg>

      <div className="b-info">
        <h1>{movie?.Title}</h1>
        <p><strong>Datum:</strong> {screeningDate}</p>
        <p><strong>Bokningsnummer:</strong> {booking?.bookingNumber}</p>
        <p><strong>Platser:</strong> Skickas till din angivna e-post </p>
        {/* {selectedSeats.length > 0 ? selectedSeats.join(", ") : }  SKA ANVÄNDAS VID SENARE TILLFÄLLE*/}
      </div>

      <div className="tick">
        <h2 className="biljett">Biljettstatus</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="icon" viewBox="0 0 16 16">
            <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M5 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2z"/>
            <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5z"/>
          </svg>
        <p className="totalsumma"><strong>Totalt: {booking?.totalPrice} kr</strong></p>
      </div>
    </div>
  );
}