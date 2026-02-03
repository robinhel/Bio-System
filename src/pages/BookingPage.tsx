import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    
    useEffect(() => {
        fetch('/api/Movies')
            .then(res => res.json())
            .catch(error => console.error('Kunde inte hämta din valda film.', error));
    }, []);

    return (
        <>
            <div className="booking-page">

            </div>
        </>
    );

}