import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Form } from "react-bootstrap";

import Avatar from "./avatar";

export default function AvatarUpload({ url, size, onUpload }) {
  const [uploading, setUploading] = useState(false);

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
      <Avatar className="mb-3" url={url} size={size} />
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
