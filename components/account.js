import { useState, useEffect } from "react";
import { Button, Container, Form, Toast, ToastContainer } from "react-bootstrap";

import { supabase } from "../utils/supabaseClient";
import AvatarUpload from "./avatarUpload";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [userEmail, setEmail] = useState("null");

  const [updatedToast, setUpdatedToast] = useState(false);
  const toastDuration = 1500;

  console.log(session);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (user != null) setEmail(user.email);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, bio, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setBio(data.bio);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, bio, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if(username == null || username.length == 0) {
        const truncatedID = String(supabase.auth.user().id).substring(0,6);
        let useDefault = confirm("You did not set a username!\nUse default username: user" + truncatedID + "?");
        if (!useDefault) return;
        username = "user" + truncatedID;
      }

      const updates = {
        id: user.id,
        username,
        bio,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      } else {
        setUpdatedToast(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
    return;
  }

  return (
    <Container className="mt-3">
      <Form>
        <AvatarUpload
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ username, bio, avatar_url: url });
          }}
        />
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your new email"
            value={userEmail}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your new username"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </Form.Group>
        <Button
          onClick={() => updateProfile({ username, bio, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </Form>
      <ToastContainer className="p-3" position="bottom-end">
        <Toast 
            onClose={() => setUpdatedToast(false)} 
            show={updatedToast} 
            delay={toastDuration} 
            autohide >
          <Toast.Header>
            <strong className="me-auto">SUCCESS</strong>
          </Toast.Header>
          <Toast.Body>Profile updated successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
