import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import routes from '../routes';
import { useAuth } from '../utils/AuthContext';

export default function Header() {

  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice().sort((a, b) => a.path.length > b.path.length ? -1 : 1)
    .find(x => pathName.indexOf(x.path.split(':')[0]) === 0);
  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  function visibleInMenu(route: any) {
    if (!route.menuLabel) return false;
    if (route.path === '/login-page' || route.path === '/register-page')
      return !user;
    if (route.path === '/Profile')
      return !!user;
    return true;
  }

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