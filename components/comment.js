import {
  Button,
  Card,
  Col,
  Row,
  Stack
} from "react-bootstrap";
import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import { useUser } from "../context/user";
import TimeAgo from "react-timeago"
import Avatar from "./avatar";
import { BiTrash } from "react-icons/bi";

export default function Comment({ idx, data }) {
  const user = useUser().user?.id;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [delIconColor, setDelIconColor] = useState("black");
  const commentID = data.id;
  useEffect(() => {
    if (data.media) downloadImage(data.media);
    if (data.user_id) downloadAvatar(data.user_id);

  }, []);

  async function downloadAvatar(userId) {
    const { data, error } = await supabase.rpc("get_avatar_url_by_user_id", {
      user_id: userId,
    });

    if (error) {
      throw error;
    }

    if (data) setAvatarUrl(data);
  }

  async function deleteComment() {
    const { error } = await supabase
      .from('comments')
      .delete()
      .match({ id: commentID })

    if (error) alert(error);
    window.dispatchEvent(new Event("deleteCommentEvent"));
  }

  return (
    <Card key={idx} className="w-100" style={{ width: "200%" }}>
      <Card.Body  style={{ backgroundColor: idx%2 ? "#e9e9e9" : "#ffffff" }}>
        <Row className="justify-content-md-center">
          <Col className="ms-auto">
            <Card.Text fluid>
            <Row className="align-items-center">
              <Col xs sm="2">
                <Stack
                  direction="horizontal"
                  gap={2}
                  className="align-items-center my-2"
                >
                  <Avatar url={avatarUrl} size={24} circle />
                  {user == null || data.user_id != user ? <strong>{data.username}</strong> : <strong>Me</strong>}
                </Stack>
              </Col>
            </Row>
            </Card.Text>
            <Card.Text style={{ marginLeft: "2rem" }}>{data.text}</Card.Text>
            <Card.Text style={{ marginLeft: "2rem" }}>
              <small className="text-muted">
                <TimeAgo date={data.createdAt} />
              </small>
            </Card.Text>
          </Col>

          <Col xs lg="1">
            { user != null 
              && data.user_id == user
              && <BiTrash 
                onMouseOver={ () => setDelIconColor("red") }
                onMouseOut={ () => setDelIconColor("black") }
                onClick={ deleteComment }
                style={{ color: delIconColor }}>
                  Delete
                </BiTrash>}
          </Col>
        </Row>
      </Card.Body>
      
    </Card>
  );
}
