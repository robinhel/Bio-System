import { Container, Row, Col } from "react-bootstrap";
import { logoFacebook, logoInstagram, logoLinkedin, logoX } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>

        <Row className="footer-content">

          {/* Wrapper som trycker allt till höger */}
          <Col xs={12} className="footer-right-wrapper">

            {/* Socials */}
            <div className="footer-socials">
              <h5 className="footer-title">Sociala medier</h5>

              <div className="social-stack">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <IonIcon icon={logoFacebook} size="large" />
                </a>

                <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                  <IonIcon icon={logoX} size="large" />
                </a>

                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <IonIcon icon={logoInstagram} size="large" />
                </a>

                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <IonIcon icon={logoLinkedin} size="large" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="footer-section">
              <h5 className="footer-title">Navigation</h5>

              <div className="nav-stack">
                <Link to="/">Hem</Link>
                <Link to="/about-us">Om Oss</Link>
                <Link to="/team">Teamet</Link>
                <Link to="/contact">Kontakta oss</Link>
              </div>
            </div>

          </Col>

        </Row>

        <hr className="H-line" />

        <Row>
          <Col className="copyright">
            © {new Date().getFullYear()} Bio Borgen | All Rights Reserved
          </Col>
        </Row>

      </Container>
    </footer>
  );
}