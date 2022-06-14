import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

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

  function getLongAndLat() {}

  async function getAllPost() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (user != null) setEmail(user.email);

      const maxDist = 2; //km
      const earthRadius = 40075.04;
      let position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      let { coords } = position;
      const myLat = coords.latitude;
      const myLon = coords.longitude;

      const degToRad = (x) => (x / 180) * Math.PI;
      const maxDiffLat = (360 * maxDist) / earthRadius; //deg
      const maxDiffLon =
        (360 * maxDist) / (earthRadius * Math.cos(degToRad(myLat)));

      let { data, error, status } = await supabase
        .from("posts")
        .select(`*`)
        .lte("latitude", myLat + maxDiffLat)
        .gte("latitude", myLat - maxDiffLat)
        .lte("longitude", myLon + maxDiffLon)
        .gte("longitude", myLon - maxDiffLon)
        .order("createdAt", { ascending: false });

      if (error && status !== 406) {
        throw error;
      }

      setPosts(data);

      // if (data) {
      //   setUsername(data.username)
      //   setWebsite(data.website)
      //   setAvatarUrl(data.avatar_url)
      // }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container id="root" className="d-flex justify-content-center">
      {posts?.map((entry, idx) => (
            <Post data={entry} idx={idx} />
      ))}
    </Container>
  );
}

