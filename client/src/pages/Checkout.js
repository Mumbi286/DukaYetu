// client/src/pages/Checkout.js
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const Checkout = () => {
  const [form, setForm] = useState({ name: "", address: "", card: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment simulated. Thank you for your order!");
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control name="address" value={form.address} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control name="card" value={form.card} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="success">Pay</Button>
      </Form>
    </div>
  );
};

export default Checkout;
