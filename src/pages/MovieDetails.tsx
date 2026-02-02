import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

MovieDetails.route = {
    path: "/movie-details/:id",
    index: 2,
};

type Movie = {
    id: number;
    Title: string;
    Description: string;
    Genre: string;
    Cover: string;
    AgeRating: number;
};

export default function MovieDetails() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/Movies/${id}`)
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

    if (error) return <p>{error}</p>;
    if (!movie) return <p>Laddar...</p>;

    return (
        <>
            <div className="movie-details">
                <h1>{movie.Title}</h1>
                <h1></h1>

                <div className="movie-cover">
                    {movie.Cover && (
                        <img
                            src={movie.Cover}
                            alt={`Cover for ${movie.Title}`}
                            style={{ maxWidth: "300px" }}
                        />
                    )}
                </div>

                <div className="movie-description">
                    <h2>Description</h2>
                    <p>{movie.Description}</p>
                </div>

                <div className="movie-details">
                    <h2>Details</h2>
                    <p>Genre: {movie.Genre}</p>
                    <p>Age rating: {movie.AgeRating}</p>
                </div>
            </div>
        </>
    );
}
