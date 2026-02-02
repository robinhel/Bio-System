AboutUsPage.route = {
    path: '/about-us',
    menuLabel: 'About us',
    index: 3,
};

export default function AboutUsPage() {
    return(
        <div className="container">
            <h1>Om Bio Borgen!</h1>
            <img src="/images/Biograf.jpg" alt="Picture of a cinema" />
            <p className="header">
                Välkommen till Bio Borgen – din lokala portal till filmens magiska värld.
            </p>
            <section className="section1">
                <h2>Vår historia!</h2>
                <p>
                    Bio Borgen grundades med en enkel vision: att skapa en plats där teknik möter tradition. 
                    Namnet "Borgen" står för trygghet, kvalitet och en storslagen upplevelse. Vi har förvandlat 
                    den klassiska biokänslan till en modern mötesplats för alla filmälskare.
                </p>
            </section>
            <section className="section2">
                <h2>Våra salonger</h2>
                <p>
                    Vi är stolta över att erbjuda två unika salonger anpassade för olika typer av upplevelser:
                </p>
                <ul>
                    <li>
                        <strong>Stora Salongen:</strong> Vårt flaggskepp med 150 platser, utrustad med det senaste 
                        inom ljudteknik och en duk som låter dig försvinna in i storfilmerna.
                    </li>
                    <li>
                        <strong>Lilla Salongen:</strong> En intim miljö med 60 platser, perfekt för drama, 
                        familjefilm eller en mer personlig filmupplevelse.
                    </li>
                </ul>
            </section>
            <section className="section2">
                <h2>Här finns vi</h2>
                <p>
                    Du hittar oss i hjärtat av staden, där vi varje dag poppar färska popcorn och 
                    rullar ut den röda mattan för dig. Oavsett om du vill se den senaste blockbustern 
                    från Marvel eller en gripande indie-film, har Bio Borgen en plats för dig.
                </p>
            </section>
            <footer className="section3">
                <p><em>Vi ses i mörket! </em></p>
            </footer>
        </div>
        
        );
}