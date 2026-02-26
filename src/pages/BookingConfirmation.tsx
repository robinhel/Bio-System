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
  fetch('/api/movies')
    .then(res => res.json())
    .then(data => setMovies(data));
}, []);  
  const filterMovie = movies.filter((movie) =>
    movie.Title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="c-section">
        <img className="ava" src="/images/avatar.webp" alt="Avatar cover" />
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" className="qr-code" viewBox="0 0 16 16">
          <path d="M2 2h2v2H2z"/>
          <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
          <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
          <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
          <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
        </svg>
        <div className ="b-info">
          <p><strong>När:</strong> 18.00-19.50, 2026-02-10</p>
          <p><strong>Bokningsreference:</strong> WXMTDG</p>
          <p><strong>Hall:</strong> Stora salongen</p>
          <p><strong>Stolnummer:</strong> A-4, A-3</p>
          <p><strong>Bokningsdag:</strong> 12.30, 2026-02-17</p>
        </div>
        <div className="tick">
          <h2 className="biljett">Biljetter </h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="icon" viewBox="0 0 16 16">
            <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M5 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2z"/>
            <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5z"/>
          </svg>
          <p className="antal"> <strong>2 x Vuxna </strong>- 105 sek </p>
          <p className="totalsumma"><strong>Totalt: 210 sek</strong></p>
        </div>
      </div>
  )

 }