import { Button, Card, Col, Container, Row, Stack, Modal, ToggleButton, ButtonGroup} from "react-bootstrap";
import { FiMoreHorizontal } from "react-icons/fi"
import { supabase } from '../utils/supabaseClient'
import { useState, useEffect } from "react"
import Link from "next/link"
import Router from "next/router"
import { useUser } from "../context/user";

export default function Post({ idx, data }) {
  // Convert timestamp to human readable time
  const timestampDate = new Date(data.createdAt);
  const date = timestampDate.toDateString();
  const time = timestampDate.toLocaleTimeString();

  const user = useUser().user.id
  const [mediaUrl, setMediaUrl] = useState(null)
  const [modalShow, setModalShow] = useState(false)

  useEffect(() => {
      if (data.media) downloadImage(data.media)
    }, [])

  // Truncate content to MAX_CONTENT_LENGTH
  const MAX_CONTENT_LENGTH = 1200;
  let truncatedContent = String(data.text);
  truncatedContent =
    truncatedContent.length > MAX_CONTENT_LENGTH
      ? truncatedContent.substring(0, MAX_CONTENT_LENGTH) + "..."
      : truncatedContent;

  async function downloadImage(path) {
    try {
        const { data, error } = await supabase.storage.from('media').download(path)
        if (error) {
        throw error
        }
        console.log(data)
        const url = URL.createObjectURL(data)
        setMediaUrl(url)
        console.log(mediaUrl)
    } catch (error) {
        console.log('Error downloading image: ', error.message)
    }
  }

  async function deletePost(postID) {
      alert("Are you sure to delete this post?")
      try {
          let { data, error, status } = await supabase
              .from('posts')
              .delete()
              .match({ id: postID})
              .single()
  
          if (error) {
              throw error
          } 

          const deletedMedia = data.media

          if (data.media) {
              let { error, status } = await supabase
                  .storage
                  .from('media')
                  .remove([`folder/${deletedMedia}`])
              console.log(status)
              if (error) {
                  throw error
              } 
          }

          console.log(data)
          alert("Deleted successfully!")
          Router.reload(window.location.pathname)

      } catch (error) {
          alert(error.message)
      } 
  }  
  

  return (
    <Card key={idx} className="w-lg-75">
      <Card.Img variant="top" src={mediaUrl} />
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

                <FiMoreHorizontal onClick={() => setModalShow(true)}/>
                <Modal className="modal fade" 
                       show={modalShow} 
                       onHide={() => setModalShow(false)}
                       centered={true}
                       bac>
                  {
                    user == data.user_id ? (
                      <ButtonGroup vertical={true}>
                        <Link href={{pathname: `/modify-post`, query: {postID: data.id},}} 
                          as={`posts/edit/${data.id}`}>
                          <Button variant="outline-primary">Edit</Button>
                        </Link>
                        <Button onClick={() => deletePost(data.id)} variant="outline-danger">Delete</Button>
                      </ButtonGroup> ) : (
                      <ButtonGroup vertical={true}>
                        <Button variant="outline-primary">More</Button>
                        <Button variant="outline-primary">Save</Button>
                      </ButtonGroup> )
                  }
                </Modal>

                <ToggleButton className="ms-auto" variant="outline-danger" size="sm">
                  -{data.downvotes}
                </ToggleButton>
                <div>{data.score}</div>
                <ToggleButton variant="outline-success" size="sm">
                  +{data.upvotes}
                </ToggleButton>
              </Stack>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

