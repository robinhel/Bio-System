import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


MovieDetails.route = {
    path: "/movie-details/:id",
    index: 2,
};
interface Screenings {
    id: number;
    movieId: number;
    theaterId: number;
    startTime: string;
    endTime: string;
}
interface Movie {
    id: number;
    Title: string;
    Description: string;
    Genre: string;
    Cover: string;
    AgeRating: number;
    trailer: string;
};

export default function MovieDetails() {
    const { id } = useParams<{ id: string; }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [screenings, setScreenings] = useState<Screenings[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return;

        fetch(`/api/movies/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Kunde inte hämta film");
                return res.json();
            })
            .then((data: Movie) => {
                console.log("API DATA:", data);
                setMovie(data);
            })
            .catch((err) => setError(err.message));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/screenings?movieId=${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("SCREENINGS DATA:", data);
                setScreenings(data);
            })
            .catch(err => console.log(err));
    }, [id]);


    if (error) return <p>{error}</p>;
    if (!movie) return <p>Laddar...</p>;
    const movieScreenings = screenings.filter(
        s => s.movieId === Number(id)
    );
    const dates = [...new Set(
        movieScreenings.map(s => s.startTime.split("T")[0])
    )];


    return (
        <div className="movie-details-page">
            <h1>{movie.Title}</h1>

            <div className="movie-box">
                <div className="movie-trailer">
                    <iframe
                        src={`https://www.youtube.com/embed/${movie.trailer}`}
                        title="Movie trailer"
                        allowFullScreen
                    />
                </div>

                {movie.Cover && (
                    <img
                        className="movie-cover"
                        src={movie.Cover}
                        alt={movie.Title}
                    />
                )}
            </div>

            <div className="details-container">
                <div>
                    <h2>Beskrivning</h2>
                    <p>{movie.Description}</p>
                </div>

                <div>
                    <h2>Detaljer</h2>
                    <p>Genre: {movie.Genre}</p>
                    <p>Åldersgräns: {movie.AgeRating}</p>
                </div>
            </div>


            <div className="tickets-card">
                <h1>Biljetter</h1>
                <div className="date-row">
                    {dates.map(date => (
                        <button
                            key={date}
                            className={`date-button ${selectedDate === date ? "active" : ""}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            {date}
                        </button>
                    ))}
                </div>
            </div>


            {selectedDate && (
                <div className="times">
                    <h1>Bio Borgen</h1>

                    <div className="time-slots">
                        {movieScreenings.map(screening => {

                            if (screening.movieId !== Number(id)) return null;

                            const dateKey = screening.startTime.split("T")[0];

                            if (dateKey !== selectedDate) return null;

                            const start = new Date(screening.startTime);
                            const end = new Date(screening.endTime);

                            const timeSpan =
                                start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
                                " - " +
                                end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                            return (
                                <Link
                                    key={screening.id}
                                    to={`/booking-page/${screening.id}`}
                                    className="time-button"
                                >
                                    <span className="salong">
                                        Salong {screening.theaterId}
                                    </span>
                                    <span className="time">
                                        {timeSpan}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}


        </div>
    );
}


