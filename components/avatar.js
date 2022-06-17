import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Form, Image } from "react-bootstrap";

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="mb-3">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            style={{ height: size, width: size }}
            thumbnail
          />
        ) : (
          <div style={{ backgroundColor: "gray", height: size, width: size }} />
        )}
      </div>
      <Form.Group controlId="avatarUpload" className="mb-3">
        <Form.Label>{uploading ? "Uploading ..." : "Avatar"}</Form.Label>
        <Form.Control
          type="file"
          size="sm"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </Form.Group>
    </>
  );
}

