import { useState, useEffect } from "react";
import { Container, Stack, Spinner } from "react-bootstrap";

import { supabase } from "../utils/supabaseClient";
import { useUser } from "../context/user";
import Post from "../components/post";

export default function MainPage() {
  const { user } = useUser(true);

  const [userEmail, setEmail] = useState("null");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    if (user != null) setEmail(user.email);
    else setEmail("null");
    getAllPost();
  }, []);

  async function getAllPost() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (user != null) setEmail(user.email);

      let maxRadius = parseFloat(localStorage.getItem("maxRadius")) ; //meters
      maxRadius = maxRadius == NaN ? 500 : maxRadius;
      console.log("Current max radius: " + maxRadius)
      let position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      let { coords } = position;
      const myLat = coords.latitude;
      const myLon = coords.longitude;

      let { data, error, status } = await supabase.rpc(
        "get_position_within_radius_query",
        { myLat: myLat, myLon: myLon, r: maxRadius }
      );

      if (error && status !== 406) {
        throw error;
      }

      setPosts(data);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
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
          {posts?.map((entry, idx) => (
            <Post data={entry} idx={idx} key={idx}/>
          ))}
        </Stack>
      )}
    </Container>
  );
}
