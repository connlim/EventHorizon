import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { Button, Card, Form, Stack } from "react-bootstrap";

export default function Auth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      router.push("/main-page");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("Sign up successful! Please Set up your account");
      router.push("/settings");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card body>
      <Card.Title>
        <h1>Event Horizon</h1>
      </Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        Sign in or Sign up with your email below
      </Card.Subtitle>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={3}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
            disabled={loading}
          >
            <span>{loading ? "Loading" : "Sign In"}</span>
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSignUp(email, password);
            }}
            disabled={loading}
          >
            <span>{loading ? "Loading" : "Sign Up"}</span>
          </Button>
        </Stack>
      </Form>
    </Card>
  );
}
