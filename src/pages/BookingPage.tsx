import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form } from 'react-bootstrap';

BookingPage.route = {
    path: '/booking-page',
    menuLabel: 'Booking Page',
    index: 5,
};

interface Movie
 {
    id: number;
    Title: string;
    Description: string;
    Genre: string;
    Cover: string;
    AgeRating: number;
 }



export default function BookingPage() {

    const [movie, setMovie] = useState<Movie | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    
    useEffect(() => {
        fetch('/api/Movies')
            .then(res => res.json())
            .then(data => {
                const firstMovie = data[0];
                setMovie(firstMovie);
            })
            .catch(error => console.error('Kunde inte hämta din valda film.', error));
    }, []);


    return (
        <>
            <div className="booking-page">
            <h1>Bokning för {movie?.Title}</h1>
            <div className="formlabel">
                <Form.Label> Ändra Datum </Form.Label>
                <Form.Control
                    type="date"
                    className="date-picker"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            <img src={movie?.Cover} alt={movie?.Title} className="booking-poster" />
            <div className="poster-text">
            <p>Valt datum: {selectedDate || "2026-02-15"}</p>
            <p>Salong: Borgen Lilla</p>
            <p>Åldersgräns : {movie?.AgeRating}</p>
            </div>
            </div>
        </>
    );

}