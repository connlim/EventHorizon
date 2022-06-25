import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Stack,
  Modal,
  ToggleButton,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FiMoreHorizontal } from "react-icons/fi";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { useUser } from "../context/user";

import Avatar from "./avatar";

export default function Post({ idx, data }) {
  // Convert timestamp to human readable time
  const timestampDate = new Date(data.createdAt);
  const date = timestampDate.toDateString();
  const time = timestampDate.toLocaleTimeString();

  const user = useUser().user?.id;
  const [mediaUrl, setMediaUrl] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const [upvotes, setUpvotes] = useState(data.upvotes)
  const [downvotes, setDownvotes] = useState(data.downvotes)
  const [score, setScore] = useState(data.score)
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    if (data.media) downloadImage(data.media);
    if(user) checkVote(data.id);
  }, []);

  // Truncate content to MAX_CONTENT_LENGTH
  const MAX_CONTENT_LENGTH = 1200;
  let truncatedContent = String(data.text);
  truncatedContent =
    truncatedContent.length > MAX_CONTENT_LENGTH
      ? truncatedContent.substring(0, MAX_CONTENT_LENGTH) + "..."
      : truncatedContent;

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("media")
        .download(path);
      if (error) {
        throw error;
      }
      console.log(data);
      const url = URL.createObjectURL(data);
      setMediaUrl(url);
      console.log(mediaUrl);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function deletePost(postID) {
    alert("Are you sure to delete this post?");
    try {
      let { data, error, status } = await supabase
        .from("posts")
        .delete()
        .match({ id: postID })
        .single();

      if (error) {
        throw error;
      }

      const deletedMedia = data.media;

      if (data.media) {
        let { error, status } = await supabase.storage
          .from("media")
          .remove([`folder/${deletedMedia}`]);
        if (error) {
          throw error;
        }
      }

      console.log(data);
      alert("Deleted successfully!");
      Router.reload(window.location.pathname);
    } catch (error) {
      alert(error.message);
    }
  }

  async function vote(postID, type) {
    if(!user) {
      alert("You need to be a logged in user to vote on a post!");
      return;
    }
    try {

      let delVote = false
      if (type == 'upvotes') {
        if(upvoted) {
          setUpvoted(false);
          delVote = true
        } else {
          setDownvoted(false)
          setUpvoted(true)
        }
      } else {
        if(downvoted) {
          setDownvoted(false);
          delVote = true
        } else {
          setDownvoted(true)
          setUpvoted(false)
        }
      }

      if (!delVote) {
        let { data, error, status } = await supabase
          .from("votes")
          .insert({post_id: postID, user_id: user, vote_type: type})
          .single()
        if (error) throw error;
      } else {
        let { data, error } = await supabase
          .from("votes")
          .delete()
          .match({post_id: postID, user_id: user})
          if (error) throw error;
      }

      updateScore(postID)

    } catch (error) {
      console.log(error.message)
      alert(error.message);
    }
  }

  async function checkVote(postID) {
    try{    
      let { data, error } = await supabase
        .from("votes")
        .select("vote_type", "user_id")
        .match({post_id: postID, user_id: user});
      if (error) throw error;
      if (data[0]) {data[0].vote_type == "upvotes" ? setUpvoted(true) : setDownvoted(true);}
      else {
        setUpvoted(false);
        setDownvoted(false);
      }
    } catch(error) {
      console.log(error.message)
      alert(error.message);
    }
  }
  
  async function updateScore(postID) {
    try{  
      console.log("checking")  
      let { data, error } = await supabase
        .from("posts")
        .select("upvotes, score, downvotes")
        .eq('id', postID)
        .single();
      if (error) throw error;
      console.log(data)
      setDownvotes(data.downvotes)
      setScore(data.score)
      setUpvotes(data.upvotes)
    } catch(error) {
      console.log(error.message)
      alert(error.message);
    }
  }

  const ConditionalWrapper = ({
    condition,
    wrapper,
    children,
  }) => (condition ? wrapper(children) : children);

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
                <Stack direction="horizontal" gap={2} className="align-items-center my-2">
                  <Avatar url={data.avatar_url} size={24} circle />
                  <div>{data.username}</div>
                </Stack>
                <div className="text-muted">
                  {date} {time}
                </div>
                <div className="text-muted small">
                  {data.latitude}, {data.longitude}
                </div>
              </Stack>
            </Col>
            <Col>
              <Stack>
                <ConditionalWrapper
                  condition={!user}
                  wrapper={children => (
                    <OverlayTrigger
                        overlay={<Tooltip>Sign In to Vote!</Tooltip>}
                        placement='top'
                    >
                        {children}
                    </OverlayTrigger>
                    )}
                >
                  <Stack className="ms-auto" direction="horizontal" gap={3}>
                    <ToggleButton variant="outline-danger" size="sm"
                      type="radio"
                      checked={downvoted}
                      onClick={() => vote(data.id, "downvotes")}
                      disabled={user == null}>
                      -{downvotes}
                    </ToggleButton>
                    <div>{score}</div>
                    <ToggleButton variant="outline-success" size="sm"
                      type="radio"
                      checked={upvoted}
                      onClick={() => vote(data.id, "upvotes")}
                      disabled={user == null}>
                      +{upvotes}
                    </ToggleButton>
                  </Stack>
                </ConditionalWrapper>
                
                <div className="ms-auto mt-2">
                  <FiMoreHorizontal onClick={() => setModalShow(true)} />
                  <Modal
                    className="modal fade"
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    centered={true}
                  >
                    {user == data.user_id ? (
                      <ButtonGroup vertical={true}>
                        <Link
                          href={{
                            pathname: `/modify-post`,
                            query: { postID: data.id },
                          }}
                          as={`posts/edit/${data.id}`}
                        >
                          <Button variant="outline-primary">Edit</Button>
                        </Link>
                        <Button
                          onClick={() => deletePost(data.id)}
                          variant="outline-danger"
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    ) : (
                      <ButtonGroup vertical={true}>
                        <Button variant="outline-primary">More</Button>
                        <Button variant="outline-primary">Save</Button>
                      </ButtonGroup>
                    )}
                  </Modal>
                </div>
              </Stack>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}
