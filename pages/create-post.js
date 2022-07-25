// pages/create-post.js
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { Button, Container, Form, Stack, Toast, ToastContainer } from "react-bootstrap";

const initialState = { username: "", content: "", lat: 0.0, lon: 0.0 };

function CreatePost() {
  const [post, setPost] = useState(initialState);
  let { username, content, lat, lon } = post;
  const router = useRouter();

  const [toastShow, setToastShow] = useState(false);
  const toastDuration = 1500;

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function createNewPost() {
    if (!content) return;

    const user = supabase.auth.user();

    const { data: userInfo } = await supabase
      .from("profiles")
      .select(`username`)
      .single();

    if (!userInfo) {
      alert("Ohno your user info cannot be found at the moment!\nCheck if you have setup your profile in settings page?");
      router.push("/settings");
      return;
    }
    username = userInfo.username;

    if (!navigator) {
      alert("No navigator service available on your browser! Consider using a different browser.");
      return;
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { data, error, status } = await supabase
          .from("posts")
          .insert([
            {
              text: content,
              username: username,
              user_id: user.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          ])
          .single();

        console.log(post);
        if (status == 201 && !error) {
          setToastShow(true)
          await new Promise(r => setTimeout(r, toastDuration));
          router.push("/main-page");
        } else {
          alert(error);
        }
      });
    }
  }

  return (
    <Container className="mt-3">
      <Stack gap={3}>
        <h1 className="mb-3">Create new post</h1>
        <Form.Control
          as="textarea"
          onChange={onChange}
          name="content"
          placeholder="Your post"
          value={post.content}
        />
        <Stack direction="horizontal" gap={3}>
          <Button type="button" onClick={createNewPost}>
            Create Post
          </Button>
          {/* <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                  if (result.state == "granted") {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setPost(() => ({
                          ...post,
                          lat: position.coords.latitude,
                          lon: position.coords.longitude,
                        }));
                        console.log(post.lat + ", " + post.lon);
                      },
                      (error) => console.log("Error due to " + error)
                    );
                  } else {
                    console.log(
                      "Browser location services disabled",
                      navigator
                    );
                  }
                });
            }}
          >
            Test Location
          </Button> */}
        </Stack>
      </Stack>
      <ToastContainer className="p-3" position="bottom-end">
        <Toast 
            onClose={() => setToastShow(false)} 
            show={toastShow} 
            delay={toastDuration} 
            autohide >
          <Toast.Header>
            <strong className="me-auto">SUCCESS</strong>
          </Toast.Header>
          <Toast.Body>Post created successfully! Refreshing Soon ...</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default CreatePost;
