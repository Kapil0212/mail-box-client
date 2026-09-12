import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';

const Navbar = ({ screen, setScreen }) => {
  return (
    <BootstrapNavbar bg="white" expand="lg" className="main-navbar">
      <Container fluid>
        <BootstrapNavbar.Brand
          className="brand-name"
          onClick={() => setScreen('welcome')}
        >
          Mailbox
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto">

            <Nav.Link onClick={() => setScreen('welcome')}>
              Home
            </Nav.Link>

            {screen !== 'login' && screen !== 'signup' && (
              <Nav.Link onClick={() => setScreen('compose')}>
                Compose
              </Nav.Link>
            )}

            {screen !== 'login' && screen !== 'signup' && (
              <Nav.Link onClick={() => setScreen('welcome')}>
                Mailbox
              </Nav.Link>
            )}

            {(screen === 'login' || screen === 'signup') && (
              <Nav.Link
                onClick={() =>
                  setScreen(
                    screen === 'login' ? 'signup' : 'login'
                  )
                }
              >
                {screen === 'login' ? 'Sign Up' : 'Login'}
              </Nav.Link>
            )}

          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;