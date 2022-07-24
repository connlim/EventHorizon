import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Media from '../components/media'
import { Button, Container, Form, Stack, Toast, ToastContainer } from "react-bootstrap";

function ModifyPost() {

  const { query } = useRouter();
  let initialState = { id: null, username: '', content: '', media: null } ;
  const router = useRouter();
  const [post, setPost] = useState(initialState);
  const [media_url, setMediaUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  let { id, username, content, media } = post;

  const [toastShow, setToastShow] = useState(false);
  const toastDuration = 1500;

  useEffect(() => {
    if(query.postID) getPost(query.postID);
  }, [])

  async function getPost(postID) {
      try {
        setLoading(true)

        let { data, error, status } = await supabase
            .from('posts')
            .select(`username, text, media`)
            .eq('id', postID)
            .single()

        if (error && status !== 406) {
            throw error
        }

        if (data) {
          setPost(() => ({  id: postID, username: data.username, content: data.text, media: data.media }))
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
  }

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value,}))
  }
  
  async function createNewPost() {
    if (!content) {
      alert("Please include some content!")
      return
    }
    
    const user = supabase.auth.user()

    const { data: userInfo} = await supabase
      .from('profiles')
      .select(`username`)
      .single()

    if(!userInfo) {
      alert("Sign up successful! Please Set up your account first.");
      router.push("/settings")
      return;
    }
    username = userInfo.username

    if(!navigator) { 
      alert("No navigator service available on your browser! Consider using a different browser.");
      return;
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        
        const { data, error, status } = id 
          ? await supabase
            .from('posts')
            .upsert([
                {
                  id: id,
                  text: content, 
                  username: username,
                  user_id: user.id,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  media: media_url
                }
            ])
            .single()
          : await supabase
            .from('posts')
            .insert([
                {
                  text: content, 
                  username: username,
                  user_id: user.id,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  media: media_url
                }
            ])
          .single()

        if(status == 201 && !error) {
          setToastShow(true)
          await new Promise(r => setTimeout(r, toastDuration));
          router.push("/main-page")
        } else {
          alert(error)
        }
      })
    }

  }

  return (
    <Container className="mt-3">
      <Stack gap={3}>
        <h1 className="mb-3">Edit your post</h1>
        {/* <div style={{display: 'flex', marginTop: '2rem'}}>
          <div 
            style={{
              display:'flex',
              justifyContent: 'space-evenly',
              marginLeft: 'auto',
              marginRIght: '2rem'}}>
            <Media
              url={media_url}
              size={640}
              border={"1px solid black"}
              onUpload={(url) => {
                  setMediaUrl(url)
                  setPost(() => ({ ...post, media: url,}))
              }}
            /> 
          </div>
        </div> */}
        <Form.Control
        as="textarea"
        onChange={onChange}
        name="content"
        placeholder="Your post"
        value={post.content}
        />        
        <Stack direction="horizontal" gap={3}>
          <Button type="button" onClick={createNewPost}>
            Save Post
          </Button>
          <Button
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
          </Button>
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
          <Toast.Body>Post updated successfully! Refreshing Soon ...</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default ModifyPost