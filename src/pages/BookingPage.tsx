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
    const [adult, setAdult] = useState(0);
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
        setAdult(0);
        setKid(0);
        setPensioner(0);
    };




    useEffect(() => {
        fetch('/api/Movies')
            .then(res => res.json())
            .then(data => {
                const firstMovie = data[0];
                setMovie(firstMovie);
            })
            .catch(error => console.error('Kunde inte hämta din valda film.', error));
    }, []);

    const seatsPerRow = [8, 9, 10, 10, 10, 10, 12, 12];

    // Skapa en state för att hålla koll på valda säten (använd string[] för "Rad-Stol")
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const totalTickets = adult + pensioner + kid;





    return (
        <>
            <div className="booking-page">
                <h1>Bokning för {movie?.Title}</h1>
                <div className="bookingdetail">
                        <div className="theater-layout">
                        {/* Visar texten "SKÄRMEN" längst upp i salongen */}
                        <div className="theater-screen">
                           
                            <p>SKÄRMEN</p>
                            </div>
                        
                        {/* Yttre form-tagg (du kan ta bort en av dessa då du har dubbla nu) */}
                        <form className="seating-grid">
                            
                            {/* 1. YTTRE LOOP: Går igenom listan 'seatsPerRow' (t.ex. [8, 9, 10...]) */}
                            {/* Varje siffra i listan skapar en ny rad (numSeats) på ett visst radnummer (rowIndex) */}
                            {seatsPerRow.map((numSeats, rowIndex) => (
                                
                                /* Skapar en div för varje rad så att stolarna hamnar på rätt linje */
                                <div key={`row-${rowIndex}`} className="seat-row">
                                
                                {/* 2. INRE LOOP: Skapar rätt antal stolar för just den här raden */}
                                {/* Array.from skapar en tillfällig lista med längden 'numSeats' så att vi kan loopa fram stolarna */}
                                {Array.from({ length: numSeats }).map((_, seatIndex) => {
                                    
                                    /* Skapar ett unikt ID för varje stol, t.ex. 'R1-S1' (Rad 1, Stol 1) */
                                    /* Vi lägger till +1 eftersom datorn börjar räkna på 0, men vi vill se rad 1 */
                                    const seatId = `R${rowIndex + 1}-S${seatIndex + 1}`;

                                    return (
                                    /* Labeln fungerar som den klickbara ytan för varje stol */
                                    <label key={seatId} className="seats">
                                        
                                        {/* Den osynliga checkboxen som håller koll på om stolen är vald eller ej */}
                                        <input
                                        name="seats"
                                        type="checkbox"
                                        value={seatId}
                                        className="Visually-hidden" // Döljer standardrutan så vi bara ser din design
                                        checked={selectedSeats.includes(seatId)} // Kollar om seatid på den valda platsen finns med i vår lista
                                        
                                        />
                                        
                                        {/* 3. STOLNUMRET: Visar siffran 1, 2, 3 osv. inuti varje stolruta */}
                                        <span>{/* {seatIndex + 1} */}
                                        {/* <i className="bi bi-person-check-fill fs-5"></i> */}
                                        
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


                        {/* <form>
                            <label className="seats">
                                <input name="seats" type="radio" className="Visually-hidden" disabled />
                            </label>
                            <label className="seats">
                                <input name="seats" type="radio" className="Visually-hidden" disabled />
                            </label>
                            <label className="seats">
                                <input name="seats" type="radio" className="Visually-hidden" disabled />
                            </label>
                        </form> */}

                    <img className="seats-pic" src="https://cdn.discordapp.com/attachments/1426165952348688414/1468916741919735849/image.png?ex=6985c2d2&is=69847152&hm=1ec8efa1129450fdfe90660a63fdfff909398247cea0c406a82b395fde94d9d2&" alt="" />
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
                <div className="bookinginformation">
                    <Alert show={show} variant="success">
                        <Alert.Heading>Bokningssammanfattning</Alert.Heading>
                        <hr />
                        <div className="ticket-list">
                            {adult > 0 && <p>🎟️ {adult} Vuxen</p>}
                            {pensioner > 0 && <p>🎟️ {pensioner} Pensionär</p>}
                            {kid > 0 && <p>🎟️ {kid} Barn</p>}
                        </div>
                        <p>📍 Rad 67, Plats 13-14</p>
                        <p> {totalPrice > 0 && `💵 ${totalPrice}kr`}</p>
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