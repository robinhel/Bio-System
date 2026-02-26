import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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