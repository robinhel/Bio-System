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
    s   tartTime: string;
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
    return (
        <>
            <div className="movie-details-page">
                <h1>{movie.Title}</h1>
                <h1></h1>

                <div className="movie-box">
                    <div className="movie-trailer">
                        <iframe
                            src={`https://www.youtube.com/embed/${movie.trailer}`}
                            title="Movie trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {movie.Cover && (
                        <img className="movie-cover"
                            src={movie.Cover}
                            alt={`Cover for ${movie.Title}`}
                        />
                    )}
                </div>
                <div className="details-container">
                    <div className="movie-description">
                        <h2>Beskrivning</h2>
                        <p>{movie.Description}</p>
                    </div>

                    <div className="movie-details">
                        <h2>Detaljer</h2>
                        <div className="details-container-p">
                            <p>Genre: {movie.Genre}</p>
                            <p>Åldersgräns: {movie.AgeRating}</p>
                        </div>
                    </div>
                </div>
                <div className="time-slots">
                    <div className="time-box">
                        {screenings
                            .map(screening => {
                                if (movie.id != screening.movieId) {
                                    console.log(movie.id)
                                }
                                else {
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
                                            className="time-slot"
                                        >
                                            {timeSpan}
                                        </Link>
                                    );
                                }
                            })}

                    </div>
                </div>
            </div>
        </>
    );
}
// ha en sortera datum på rad som är defualt inget, när man väljer datum
// datum kommer tider för just den dagen i samma box

