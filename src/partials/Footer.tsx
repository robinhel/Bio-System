import { Container, Row, Col } from 'react-bootstrap';
import { logoFacebook, logoTwitter, logoInstagram, logoLinkedin } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <Container>
        <Row className="justify-content-center mb-3">
          <Col xs="auto">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoFacebook} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoTwitter} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoInstagram} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoLinkedin} />
            </a>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-center mb-3">
          <Col xs="auto"><Link to="/">Hem</Link></Col>
          <Col xs="auto"><Link to="/about-us">Om Oss</Link></Col>
          <Col xs="auto"><Link to="/team">Teamet</Link></Col>
          <Col xs="auto"><Link to="/contact">Kontakta oss</Link></Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col className="text-center py-3 text-bg-primary">
            © {new Date().getFullYear()} Grupp 2 | All Rights Reserved
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
