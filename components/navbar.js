import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Container, Col, Form, 
  Modal, Nav, Navbar, InputGroup, Row, NavDropdown } from "react-bootstrap";


export default function CustomNavbar(props) {
  const router = useRouter();
  const [modalShow, setModalShow] = useState(false);
  const [currLatLon, setCurrLatLon] = useState([0,0]);
  const [validated, setValidated] = useState(false);
  const [maxRadius, setMaxRadius] = useState(NaN);
  const [orderType, setOrderType] = useState('createdAt');
  const [asc, setAscending] = useState(false);

  useEffect(() => {
    setMaxRadius(localStorage.getItem('maxRadius'));
    let orderBy = localStorage.getItem("orderType"); 
    let order = localStorage.getItem("order") === 'true'; 
    setOrderType(orderBy);
    setAscending(order);
  }, [maxRadius]);

  const handleSave = (event) => {
    const form = event.currentTarget;
    let newMaxRadius = 500;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(false);
    } else {
      newMaxRadius = parseFloat(document.getElementById("maxRadiusInput").value);
    }
    localStorage.setItem("maxRadius", newMaxRadius);
    setMaxRadius(newMaxRadius)
    setValidated(true);
  };

  function updateOrder(param, value) {
    localStorage.setItem(param, value);
    if (param == "orderType") setOrderType(value);
    if (param == "order") setAscending(value);
    window.dispatchEvent(new Event("setOrderingEvent"))
  }

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
                  setCurrLatLon([loc.coords.latitude, loc.coords.longitude])
                });
              }
              setModalShow(true);
            }}
          >
            Current Radius: { maxRadius }
          </Button>
          <Modal
              className="modal fade"
              size="lg"
              show={modalShow}
              onHide={() => setModalShow(false)}
              centered={true}
            >
            <Modal.Header>Here are you position details!</Modal.Header>
            {
              <Container>
                <Form noValidate validated={validated} onSubmit={handleSave}>
                  <Form.Group as={Row}className="mb-3" controlId="maxRadiusInput">
                      <Form.Label column sm="5">Current Position: </Form.Label>
                      <Col sm="7">
                        Latitude: {currLatLon[0]}, 
                        <br />
                        Longitude: {currLatLon[1]}
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}className="mb-3" controlId="maxRadiusInput">
                      <Form.Label column sm="5">Set search radius: </Form.Label>
                      <Col sm="6">
                        <InputGroup className="mb-3">
                          <Form.Control 
                            required 
                            column size="sm" 
                            type="number" 
                            defaultValue="500"/>
                          <InputGroup.Text bg="white" size="sm">m</InputGroup.Text>
                          <Button variant="outline-primary" id="button-addon2" 
                            onClick={(e) => handleSave(e)}>Save
                          </Button>
                          <Button onClick={() => window.location.reload(false)}
                            variant="outline-secondary"
                            witdh="1%">
                            Refresh
                          </Button>
                        </InputGroup>
                      </Col>
                      <Form.Control.Feedback type="invalid">
                            Please enter the radius in metres!.
                      </Form.Control.Feedback>
                  </Form.Group>
                </Form>
              </Container>
            }
          </Modal>
          <NavDropdown
              id="nav-dropdown"
              title={"Sort By: " + (orderType == "createdAt" ? "Date" : "Score") + (asc ? " ↑" : " ↓")}
            >
              <NavDropdown.Item onClick={() => updateOrder("orderType", 'createdAt')}>Date</NavDropdown.Item>
              <NavDropdown.Item onClick={() => updateOrder("orderType", 'score')}> Score</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => updateOrder("order", true)}>Ascending ↑</NavDropdown.Item>
              <NavDropdown.Item onClick={() => updateOrder("order", false)}>Descending ↓</NavDropdown.Item>
            </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
