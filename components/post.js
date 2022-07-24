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
  InputGroup,
  Form,
  Spinner
} from "react-bootstrap";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiCommentDetail } from "react-icons/bi";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { useUser } from "../context/user";

import Avatar from "./avatar";
import Comment from "../components/comment";

export default function Post({ idx, data }) {
  // Convert timestamp to human readable time
  const timestampDate = new Date(data.createdAt);
  const date = timestampDate.toDateString();
  const time = timestampDate.toLocaleTimeString();

  const user = useUser().user?.id;
  const [mediaUrl, setMediaUrl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [commentModalShow, setCommentModalShow] = useState(false);

  const [upvotes, setUpvotes] = useState(data.upvotes);
  const [downvotes, setDownvotes] = useState(data.downvotes);
  const [score, setScore] = useState(data.score);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const postID = data.id

  useEffect(() => {
    if (data.media) downloadImage(data.media);
    if (user) checkVote(data.id);
    if (data.user_id) downloadAvatar(data.user_id);
    window.addEventListener(
      "deleteCommentEvent",
      getAllComments,
      false
   );
  }, []);

  // Truncate content to MAX_CONTENT_LENGTH
  const MAX_CONTENT_LENGTH = 1200;
  let truncatedContent = String(data.text);
  truncatedContent =
    truncatedContent.length > MAX_CONTENT_LENGTH
      ? truncatedContent.substring(0, MAX_CONTENT_LENGTH) + "..."
      : truncatedContent;

  async function downloadAvatar(userId) {
    const { data, error } = await supabase.rpc("get_avatar_url_by_user_id", {
      user_id: userId,
    });
    if (error) {
      throw error;
    }
    if (data) setAvatarUrl(data);
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("media")
        .download(path);
      if (error) {
        throw error;
      }
      // console.log(data);
      const url = URL.createObjectURL(data);
      setMediaUrl(url);
      // console.log(mediaUrl);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function deletePost(postID) {
    alert("Are you sure to delete this post?");
    try {
      let { data, error} = await supabase
        .from("posts")
        .delete()
        .match({ id: postID })
        .single();

      if (error) {
        throw error;
      }

      const deletedMedia = data.media;

      if (data.media) {
        let { error } = await supabase.storage
          .from("media")
          .remove([`folder/${deletedMedia}`]);
        if (error) {
          throw error;
        }
      }

      // console.log(data);
      alert("Deleted successfully!");
      Router.reload(window.location.pathname);
    } catch (error) {
      alert(error.message);
    }
  }

  /* Functions to handle voting and updating the score of a post */
  async function vote(postID, type) {
    if (!user) {
      alert("You need to be a logged in user to vote on a post!");
      return;
    }
    try {
      let delVote = false;
      if (type == "upvotes") {
        if (upvoted) {
          setUpvoted(false);
          delVote = true;
        } else {
          setDownvoted(false);
          setUpvoted(true);
        }
      } else {
        if (downvoted) {
          setDownvoted(false);
          delVote = true;
        } else {
          setDownvoted(true);
          setUpvoted(false);
        }
      }

      if (!delVote) {
        let { data, error, status } = await supabase
          .from("votes")
          .insert({ post_id: postID, user_id: user, vote_type: type })
          .single();
        if (error) throw error;
      } else {
        let { data, error } = await supabase
          .from("votes")
          .delete()
          .match({ post_id: postID, user_id: user });
        if (error) throw error;
      }

      updateScore(postID);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function checkVote(postID) {
    try {
      let { data, error } = await supabase
        .from("votes")
        .select("vote_type", "user_id")
        .match({ post_id: postID, user_id: user });
      if (error) throw error;
      if (data[0]) {
        data[0].vote_type == "upvotes" ? setUpvoted(true) : setDownvoted(true);
      } else {
        setUpvoted(false);
        setDownvoted(false);
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function updateScore(postID) {
    try {
      let { data, error } = await supabase
        .from("posts")
        .select("upvotes, score, downvotes")
        .eq("id", postID)
        .single();
      if (error) throw error;
      // console.log(data);
      setDownvotes(data.downvotes);
      setScore(data.score);
      setUpvotes(data.upvotes);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  /* Functions to handle getting and submitting comments to a post */

  function showComments() {
    getAllComments()
    setCommentModalShow(true)
  }

  async function getAllComments() {
    try {
      setLoading(true);

      let { data, error } = await supabase
        .from('comments')
        .select()
        .eq('post_id', postID)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      } else if (data) {
        setComments(data);
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitComment() {
    let newComment = document.getElementById("form-new-comment").value;
    console.log(newComment);
    if(!newComment) return;

    const { data: userInfo, error: userError} = await supabase
    .from('profiles')
    .select(`username`)
    .single()

    if(userError) {
      alert("Ohno your user info cannot be found at the moment! Try again later!");
      return;
    }

    const { data, error, status } = await supabase
      .from("comments")
      .insert(
        {
          text: newComment,
          user_id: user,
          post_id: postID,
          username: userInfo.username
        },
      )
      .single();

    if (!error) {
      getAllComments();
    } else {
      alert(error);
    }
  }

  const ConditionalWrapper = ({ condition, wrapper, children }) =>
    condition ? wrapper(children) : children;

  return (
    <Card key={idx} className="w-lg-75" ref={(element) => { window.postComponent = element; }}>
      <Card.Img variant="top" src={mediaUrl} />
      <Card.Body>
        <Card.Text>{truncatedContent}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Container fluid>
          <Row className="align-items-center">
            <Col className="me-auto">
              <Stack>
                <Stack
                  direction="horizontal"
                  gap={2}
                  className="align-items-center my-2"
                >
                  <Avatar url={avatarUrl} size={24} circle />
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
                  wrapper={(children) => (
                    <OverlayTrigger
                      overlay={<Tooltip>Sign In to Vote!</Tooltip>}
                      placement="top"
                    >
                      {children}
                    </OverlayTrigger>
                  )}
                >
                  <Stack className="ms-auto" direction="horizontal" gap={3}>
                    <ToggleButton
                      variant="outline-danger"
                      size="sm"
                      type="radio"
                      checked={downvoted}
                      onClick={() => vote(data.id, "downvotes")}
                      disabled={user == null}
                    >
                      -{downvotes}
                    </ToggleButton>
                    <div>{score}</div>
                    <ToggleButton
                      variant="outline-success"
                      size="sm"
                      type="radio"
                      checked={upvoted}
                      onClick={() => vote(data.id, "upvotes")}
                      disabled={user == null}
                    >
                      +{upvotes}
                    </ToggleButton>
                  </Stack>
                </ConditionalWrapper>

                <Stack className="ms-auto" direction="horizontal" gap={3} ju>
                  <div className="ms-auto mt-2" style={{ margin: "0.25rem" }}>
                    {user == data.user_id && <FiMoreHorizontal onClick={() => setModalShow(true)} />}
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

                  <div className="vr" style={{ margin: "0.25rem", marginTop: "0.5rem"}}/>

                  <div className="ms-auto mt-2" style={{ margin: "0.25rem" }}>
                    <BiCommentDetail onClick={showComments} />
                    <Modal
                      className="modal fade"
                      show={commentModalShow}
                      onHide={() => setCommentModalShow(false)}
                      centered={true}
                      size="lg"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                          {data.text}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ height: "70vh", overflowY: "auto"}}>
                        <Container id="root" className="mt-3">
                          {loading ? (
                            <Container style={{ textAlign: "center", fontSize: "x-large", justifyContent: "space-evenly" }}>
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </Spinner>
                              <p style={{marginTop: "1rem"}}>Loading...</p>
                            </Container>
                          ) : (
                            <Stack gap={3} className="align-items-center">
                              {comments?.map((entry, idx) => (
                                <Comment data={entry} idx={idx} key={idx}/>
                              ))}
                              {
                                (comments == null || comments.length == 0) && (
                                  <p style={{marginTop: "1rem",  fontSize: "x-large", fontWeight: "bold"}}>
                                    No comments yet!
                                  </p>
                                )
                              }
                            </Stack>
                          )}
                        </Container>
                      </Modal.Body>
                      <Modal.Footer style={{ padding: "1%" }}>
                        <ConditionalWrapper
                          condition={!user}
                          wrapper={(children) => (
                            <OverlayTrigger
                              overlay={<Tooltip>Sign In to Comment!</Tooltip>}
                              placement="top"
                            >
                              {children}
                            </OverlayTrigger>
                          )}
                        >
                          <InputGroup>
                            <Form.Control
                              placeholder="Make a comment!"
                              aria-label="Your Comment"
                              aria-describedby="basic-addon2"
                              id="form-new-comment"
                              disabled={!user}
                              style={{ alignSelf: "center" }}
                              // value={newComment}
                              // onChange={onCommentChange}
                              autoFocus
                            />
                            <Button 
                              variant="outline-primary" 
                              id="button-submit-comment"
                              disabled={!user}
                              onClick={submitComment}>
                              Submit
                            </Button>
                          </InputGroup>
                        </ConditionalWrapper>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </Stack>
                
              </Stack>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

export function delCommentFromList() {
  window.getCommentComponent;
}