import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export default function CustomNavbar(props) {
  const router = useRouter();
  return (
    <Navbar fixed="sticky" bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Link href="/main-page">
          <Navbar.Brand href="/main-page">Event Horizon</Navbar.Brand>
        </Link>
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto" activeKey={router.pathname}>
            {props.user ? (
              <>
                <Link href="/create-post">
                  <Nav.Link href="/create-post">Create Post</Nav.Link>
                </Link>
                <Link href="/settings">
                  <Nav.Link href="/settings">Settings</Nav.Link>
                </Link>
                <Nav.Link onClick={props.logout}>Log Out</Nav.Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Nav.Link href="/login">Sign In</Nav.Link>
                </Link>
                <Link href="/login">
                  <Nav.Link href="/login">Sign Up</Nav.Link>
                </Link>
              </>
            )}
          </Nav>
          <Button
            variant="outline-primary"
            onClick={() => {
              if (!navigator) {
                alert("No navigator service available");
              } else {
                navigator.geolocation.getCurrentPosition((loc) => {
                  alert(
                    "Latitude: " +
                      loc.coords.latitude +
                      ", Longitude: " +
                      loc.coords.longitude
                  );
                });
              }
            }}
          >
            Show My Position
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
