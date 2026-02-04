import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "./MovieDetails";

interface Movie
{
    id: number;
    Title: string;
    Description: string;
    Genre: string;
    AgeRating: number;
    Cover: string;
}

BookingConfirmation.route = {
    path: "/bookingconfirmation-page",
    menuLabel: 'Bekräftelse',
    index: 10,
};

export default function BookingConfirmation() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  fetch('/api/Movies')
    .then(res => res.json())
    .then(data => setMovies(data));
}, []);  
  const filterMovie = movies.filter((movie) =>
    movie.Title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="confirmation">
      <h2 className ="bb">Bokningsbekräftelse</h2>
      <div className="avacon">
        <img className ="ava" src="/images/avatar.webp" alt="Picture of avatar" />
        <h3 className="kvitto">Information om bokning</h3>
        <ul className ="prick">
          <li>2025-02-09</li>
            <li>Stora Salongen</li>
            <li>Järngatan 15</li>
            <li>Halland, Halmstad</li>
        </ul>
      </div>
        
      <section className="nummer">
        <h2><strong>Bokningsnummer</strong></h2>
        <ul>
          <li className ="kod">KWXODSWS</li>
        </ul>
      </section>
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" className="qr-code" viewBox="0 0 16 16">
        <path d="M2 2h2v2H2z"/>
        <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
        <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
        <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
        <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
    </svg>
        
      </div>
  )

 }


