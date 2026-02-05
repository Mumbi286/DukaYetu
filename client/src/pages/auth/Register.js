// src/pages/auth/Register.js
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (
      !form.username ||
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Username validation
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    // Email validation
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Password validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await register(
        form.username,
        form.email,
        form.firstName,
        form.lastName,
        form.password
      );

      // Show success message
      setSuccess(`Account created successfully! Welcome, ${form.username}. Redirecting to login...`);

      // Clear form
      setForm({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      // Handle specific error messages from the API
      const errorMessage = err.message || "Registration failed. Please try again.";
      setError(errorMessage);

      // Check if it's a duplicate user error
      if (errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("duplicate")) {
        setError("Username or email already exists. Please choose different ones.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Form onSubmit={handleSubmit} style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Create Account</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
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

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />
        </Form.Group>

        <Button
          type="submit"
          variant="success"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <div className="mt-3 text-center">
          <p>
            Already have an account? <Link to="/auth/login">Login here</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Register;
