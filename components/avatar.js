import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Image } from "react-bootstrap";

export default function Avatar({ className, url, size, circle }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  return (
    <div className={className}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          roundedCircle={circle}
          style={{ height: size, width: size }}
        />
      ) : circle ? (
        <div
          style={{
            backgroundColor: "gray",
            height: size,
            width: size,
            borderRadius: "50%",
          }}
        />
      ) : (
        <div style={{ backgroundColor: "gray", height: size, width: size }} />
      )}
    </div>
  );
}
