import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';



BookingPage.route = {
    path: '/booking-page',
    menuLabel: 'Booking Page',
    index: 5,
};

interface Movie {
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
    const [show, setShow] = useState(true);

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
                <div className="bookingdetail">
                    <div className="formlabel">
                        <Form.Label id="date"> Ändra Datum </Form.Label>
                        <Form.Control
                            type="date"
                            className="date-picker"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <img className="seats-pic" src="https://cdn.discordapp.com/attachments/1426165952348688414/1468916741919735849/image.png?ex=6985c2d2&is=69847152&hm=1ec8efa1129450fdfe90660a63fdfff909398247cea0c406a82b395fde94d9d2&" alt="" />
                    <img src={movie?.Cover} alt={movie?.Title} className="booking-poster" />
                    {/* <div className="poster-text">
            <p>Valt datum: {selectedDate || "2026-02-15"}</p>
            <p>Salong: Borgen Lilla</p>
            <p>Åldersgräns : {movie?.AgeRating}</p>
            </div> */}
                </div>
                <div className="bookinginformation">
                    <Alert show={show} variant="success">
                        <Alert.Heading>Din bokningsinformation</Alert.Heading>
                        <hr />
                        <p>🎟️ 1 vuxen, 1 barn</p>
                        <p>📍 Rad 67, Plats 13-14</p>
                        <p>275kr</p>
                        <hr />
                        <div className="d-flex justify-content-end">

                        </div>
                    </Alert>
                    {!show && <Button onClick={() => setShow(true)}>Öppna mig</Button>}
                </div>
                <div className="nicklas">
                    <Link to="/bookingconfirmation-page">
                        <Button variant="Primary" size="lg">
                            Bekräfta bokning
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );

}