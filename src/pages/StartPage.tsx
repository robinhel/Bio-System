import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';




StartPage.route = {
    path: '/',         // Ändrat från '*' till '/'
    menuLabel: 'Hem',  // Lägg till detta om du vill att den ska synas i menyn
    index: 1           // Bestämmer ordningen i menyn
};

export default function StartPage() {

    return <>


        <h1>BIO BORGEN</h1>
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="Sök efter en film..."
                aria-label="Sök efter en film..."
                aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
                SÖK
            </Button>
        </InputGroup>
        <a href="/movie-details/"><img src="images/oppenheimer-poster-3957317043.jpg" width="330" height="495" /></a>

    </>;

}



