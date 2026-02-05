// client/src/pages/auth/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.username || !form.password) {
      setError("Please enter username and password");
      setLoading(false);
      return;
    }

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Form onSubmit={handleSubmit} style={{ width: "400px" }}>
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="mt-3 text-center">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;
