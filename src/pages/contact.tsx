ContactPage.route = {
    path: '/contact',
    index: 3,
};
import { logoFacebook, logoTwitter, logoInstagram, logoLinkedin } from "ionicons/icons";
import { Container, Row, Col } from 'react-bootstrap';
import { IonIcon } from "@ionic/react";
export default function ContactPage() {
    return(
    
    <div>
        <h1>kontakta oss</h1>
        <p>Telefon: +46 76 023 95 43</p>
        <p>E-mail: Bio_borgen@biomail.com</p>
        <p>Fredsgatan 19 302 48 Halmstad</p>

        <h2>Ni når oss även på våra sociala medier</h2>
        <Container>
        <Row className="justify-content-center mb-3">
          <Col xs="auto">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
             <IonIcon icon={logoFacebook} style={{ fontSize: '32px', color: '#1877f2' }} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoTwitter} style={{ fontSize: '32px', color: '#1da1f2' }}/>
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoInstagram} style={{ fontsize: '32px', color: '#9900ff' }}/>
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoLinkedin} style={{ fontSize: '32px', color: '#1877f2' }}/>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
           
      
        
        );
}

