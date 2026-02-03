import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


BookingConfirmation.route = {
    path: "/bookingconfirmation-page",
    menuLabel: 'booking confirmation',
    index: 9,
};

export default function BookingConfirmation() {

const [movies, setMovies] = useState([]);

useEffect(() => {
  fetch('/api/Movies')
    .then(res => res.json())
    .then(data => setMovies(data));
}, []);  



 }


