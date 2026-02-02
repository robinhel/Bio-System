import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

interface Movie
{
    id: number;
    Title: string;
    Description: string;
    Genre: string;
    AgeRating: number;
    Cover: string;
}


StartPage.route = {
    path: '/',         // Ändrat från '*' till '/'
    menuLabel: 'Hem',  // Lägg till detta om du vill att den ska synas i menyn
    index: 1           // Bestämmer ordningen i menyn
};

export default function StartPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/Movies')
        .then(res => res.json())
        .then(data => setMovies(data))
        .catch(error => console.error ('Fel vid hämtning av filmer:', error))
    }, []);

    const filteredMovies = movies.filter(movie =>
        movie.Title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return <>
    <div className="start-page">
        <h1>BIO BORGEN</h1>
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="Sök efter en film..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            <Button variant="outline-secondary" id="button-addon2">
                SÖK
            </Button>
        </InputGroup>
        <div className="movies-grid">
            {filteredMovies.map(movie => (
             <Link to={`/movie-details/${movie.id}`} key={movie.id} className='movie-card'>
                <img src={movie.Cover} alt={movie.Title} />
                <h3>{movie.Title}</h3>
             </Link>   
            ))}
        </div>

    </div>
    </>;

}



