import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";

export default function Post({ idx, data }) {
  // Convert timestamp to human readable time
  const timestampDate = new Date(data.createdAt);
  const date = timestampDate.toDateString();
  const time = timestampDate.toLocaleTimeString();

  // Truncate content to MAX_CONTENT_LENGTH
  const MAX_CONTENT_LENGTH = 1200;
  let truncatedContent = String(data.text);
  truncatedContent =
    truncatedContent.length > MAX_CONTENT_LENGTH
      ? truncatedContent.substring(0, MAX_CONTENT_LENGTH) + "..."
      : truncatedContent;

  return (
    <Card key={idx} className="w-lg-75">
      <Card.Img variant="top" src="" />
      <Card.Body>
        <Card.Text>{truncatedContent}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Container fluid>
          <Row className="align-items-center">
            <Col className="me-auto">
              <Stack>
                <div>{data.username}</div>
                <div className="text-muted">
                  {date} {time}
                </div>
                <div className="text-muted small">
                  {data.latitude}, {data.longitude}
                </div>
              </Stack>
            </Col>
            <Col>
              <Stack direction="horizontal" gap={3}>
                <Button className="ms-auto" variant="outline-danger" size="sm">
                  -{data.downvotes}
                </Button>
                <div>{data.score}</div>
                <Button variant="outline-success" size="sm">
                  +{data.upvotes}
                </Button>
              </Stack>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

