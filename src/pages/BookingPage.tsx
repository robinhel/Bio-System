import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import 'bootstrap-icons/font/bootstrap-icons.css';



BookingPage.route = {
    path: '/booking-page',
    menuLabel: 'Bokningssida',
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
    const [adult, setAdult] = useState(1);
    const [pensioner, setPensioner] = useState(0);
    const [kid, setKid] = useState(0);
    const totalPrice = (adult * 140) + (pensioner * 100) + (kid * 60);

    const addAdult = () => setAdult(adult + 1);

    const subAdult = () => {
        if (adult > 0) {
            setAdult(adult - 1);
        }
    }

    const addPensioner = () => setPensioner(pensioner + 1);
    const subPensioner = () => {
        if (pensioner > 0) {
            setPensioner(pensioner - 1);
        }
    }

    const addKid = () => setKid(kid + 1);
    const subKid = () => {
        if (kid > 0) {
            setKid(kid - 1);
        }
    }

    const resetTickets = () => {
        setAdult(1);
        setKid(0);
        setPensioner(0);
        setSelectedSeats([]);
    };




    useEffect(() => {
        fetch('/api/movies')
            .then(res => res.json())
            .then(data => {
                const firstMovie = data[0];
                setMovie(firstMovie);
            })
            .catch(error => console.error('Kunde inte hämta din valda film.', error));
    }, []);

    const seatsPerRow = [8, 9, 10, 10, 10, 10, 12, 12];

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const totalTickets = adult + pensioner + kid;

    const handleSeatClick = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId))
        }
        else if (selectedSeats.length < totalTickets) {
            setSelectedSeats([...selectedSeats, seatId]);
        }
        else {
            alert(`Du har endast valt ${totalTickets} biljett. Lägg till fler biljetter för att boka fler platser. `)
        }
    } 





    return (
        <>
            <div className="booking-page">
                <h1>Bokning för {movie?.Title}</h1>
                <div className="bookingdetail">
                    <div className="theater-layout">
                        
                        <div className="theater-screen">
                            <p>SKÄRMEN</p>
                        </div>

                        <form className="seating-grid">

                            {seatsPerRow.map((numSeats, rowIndex) => (

                                <div key={`row-${rowIndex}`} className="seat-row">

                                    {Array.from({ length: numSeats }).map((_, seatIndex) => {

                                        const seatId = `Rad ${rowIndex + 1}  Stol ${seatIndex + 1}`;

                                        return (
                                            <label key={seatId} className="seats">
                                                <input
                                                    name="seats"
                                                    type="checkbox"
                                                    value={seatId}
                                                    className="Visually-hidden"
                                                    checked={selectedSeats.includes(seatId)}
                                                    onChange={() => handleSeatClick(seatId)}
                                                    disabled={totalTickets === 0}
                                                />
                                                <span>
                                                    <i className="bi bi-person-check check-icon fs-4"></i> {/* // gröna rutor hover */}
                                                    <i className="bi bi-person-fill-x remove-icon fs-4"></i> {/* // röda rutor hover */}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ))}
                        </form>
                    </div>
                    <img src={movie?.Cover} alt={movie?.Title} className="booking-poster" />
                </div>

                <div className="formlabel">
                    <Form.Label id="date"> Ändra Datum </Form.Label>
                    <Form.Control
                        type="date"
                        className="date-picker"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div className="ticket-selector">
                    <h1>Välj biljetter</h1>
                    <div className="category">
                        <span>Vuxen</span>
                        <div className="ticketamount">
                            <button onClick={subAdult}>
                                <i className="bi bi-dash-circle-fill"></i>
                            </button>
                            <p>{adult}</p>
                            <button onClick={addAdult} className="plusbutton">
                                <i className="bi bi-plus-circle-fill"></i>
                            </button>
                        </div>
                    </div>
                    <div className="category">
                        <span>Pensionär (65+ år)</span>
                        <div className="ticketamount">
                            <button onClick={subPensioner}>
                                <i className="bi bi-dash-circle-fill"></i>
                            </button>
                            <p>{pensioner}</p>
                            <button onClick={addPensioner} className="plusbutton">
                                <i className="bi bi-plus-circle-fill"></i>
                            </button>
                        </div>
                    </div>
                    <div className="category">
                        <span>Barn (0-15 år)</span>
                        <div className="ticketamount">
                            <button onClick={subKid}>
                                <i className="bi bi-dash-circle-fill"></i>
                            </button>
                            <p>{kid}</p>
                            <button onClick={addKid} className="plusbutton">
                                <i className="bi bi-plus-circle-fill"></i>
                            </button>
                        </div>
                    </div>
                    <div className="resetButton">
                        <Button onClick={resetTickets}>Återställ</Button>
                    </div>
                </div>
                <div className="entermail">
                    <Alert show={show} variant="success">
                        <Alert.Heading>Biljettleverans</Alert.Heading>
                        <p id="biljettinfo">För biljetter och bokningsbekräftelse.</p>
                        <hr />
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control className="inputmail" type="email" placeholder="Ange emailadress..." />
                                <Form.Text className="text-muted biljettermail">
                                    Vi skickar biljetterna till denna mail.
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </Alert>
                </div>
                <div className="bookinginformation">
                    <Alert show={show} variant="success">
                        <Alert.Heading>Bokningssammanfattning</Alert.Heading>
                        <hr />
                        <div className="ticket-list">
                            {adult > 0 && <p>🎟️ {adult} Vuxen</p>}
                            {pensioner > 0 && <p>🎟️ {pensioner} Pensionär</p>}
                            {kid > 0 && <p>🎟️ {kid} Barn</p>}
                        </div>
                        <p>📍 {selectedSeats.length > 0 ? ` Valda platser: ${selectedSeats.join(", ")} ` : "Inga valda platser."}</p>
                        <p> {totalPrice > 0 && `💵 ${totalPrice}kr`} (betalning sker på plats) </p>
                        <p>📅 {selectedDate}</p>
                        <hr />
                        <div className="d-flex justify-content-end">

                        </div>
                    </Alert>
                    {!show && <Button onClick={() => setShow(true)}>Öppna mig</Button>}
                </div>
                <div className="confirm-booking">
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