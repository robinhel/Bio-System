import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import routes from '../routes';

export default function Header() {

  // whether the navbar is expanded or not
  // (we use this to close it after a click/selection)
  const [expanded, setExpanded] = useState(false);

  // Håll koll på inloggad användare
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kolla om användaren är inloggad när komponenten laddas
  useEffect(() => {
    fetch('/api/login', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
        else setUser(null);
        setLoading(false);
      });
  }, []);

  //  get the current route
  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice().sort((a, b) => a.path.length > b.path.length ? -1 : 1)
    .find(x => pathName.indexOf(x.path.split(':')[0]) === 0);
  // function that returns true if a menu item is 'active'
  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  // Filtrera vilka knappar som ska visas baserat på inloggning
  function visibleInMenu(route: any) {
    if (!route.menuLabel) return false;

    // Dölj Login/Register om inloggad
    if (route.path === '/login-page' || route.path === '/register-page')
      return !user;

    // Visa Profil endast om inloggad
    if (route.path === '/Profile')
      return !!user;

    return true; // Alla andra knappar visas alltid
  }

  // Vänta tills vi vet om användaren är inloggad
  if (loading) return null;

  return <header>
    <Navbar
      expanded={expanded}
      expand="md"
      className="bg-primary"
      data-bs-theme="dark"
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand className="me-5" as={Link} to="/">
          ⌂ Bio Borgen
        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {routes.filter(visibleInMenu).map(
              ({ menuLabel, path }, i) =>
                <Nav.Link
                  as={Link} key={i} to={path}
                  className={isActive(path) ? 'active' : ''}
                  /* close menu after selection*/
                  onClick={() => setTimeout(() => setExpanded(false), 200)}
                >{menuLabel}</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>;
}