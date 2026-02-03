CancelBookingPage.route = {
    path: '/cancel-booking',
    menuLabel: 'Avboka',
    index: 9,
};

export default function CancelBookingPage() {
    return <>

        <div className="cancelbooking">
            <h1 className="cancelbooking-title">Avboka Bokning</h1>

            <p className="cancelbooking-label">Ange din bokningskod nedan för att avboka din bokning:</p>


            <input type="text" className="cancelbooking-input" placeholder="Bokningskod" /><br />
            <button className="cancelbooking-btn">Hämta Bokning</button>

            <ul id="list">
                <p>Datum och tid</p>

                <p>Plats</p>

                <p>Bokningsnummer</p>

                <p>Pris på bokning</p>
                <p>1kr</p>

            </ul>

            <button className="cancelbooking-btn">Avboka Bokning</button>





        </div>


    </>
}