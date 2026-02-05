// client/src/pages/Cart.js
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Button, Table, Card, Alert, Badge, InputGroup, Form, Spinner, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/priceFormatter";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty, cartTotal, loading, error } = useCart();
  const [updatingItem, setUpdatingItem] = useState(null);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdatingItem(itemId);
    await updateQty(itemId, newQty);
    setUpdatingItem(null);
  };

  const handleRemove = async (itemId, itemName) => {
    if (window.confirm(`Remove ${itemName} from cart?`)) {
      await removeFromCart(itemId);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h1 className="mb-4">Shopping Cart</h1>

      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h3 className="text-muted">Your cart is empty</h3>
            <p className="text-muted">Start shopping to add items to your cart!</p>
            <Button as={Link} to="/products" variant="primary" size="lg" className="mt-3">
              Browse Products
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const subtotal = item.price * item.qty;
                const isUpdating = updatingItem === item.id;

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>
                      <InputGroup style={{ width: "150px" }}>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                          disabled={isUpdating || item.qty <= 1}
                        >
                          
                        </Button>
                        <Form.Control
                          type="number"
                          value={item.qty}
                          min="1"
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            if (val > 0) {
                              handleQuantityChange(item.id, val);
                            }
                          }}
                          style={{ textAlign: "center" }}
                          disabled={isUpdating}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                          disabled={isUpdating}
                        >
                          +
                        </Button>
                      </InputGroup>
                      {isUpdating && (
                        <Spinner animation="border" size="sm" className="ms-2" />
                      )}
                    </td>
                    <td>
                      <strong className="text-primary">{formatPrice(subtotal)}</strong>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(item.id, item.name)}
                        disabled={isUpdating}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Card className="mt-4">
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Button as={Link} to="/products" variant="outline-secondary">
                    ← Continue Shopping
                  </Button>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="mb-3">
                    <h4>
                      Total: <Badge bg="success" className="fs-4">{formatPrice(cartTotal)}</Badge>
                    </h4>
                    <p className="text-muted small">
                      {cartItems.reduce((sum, item) => sum + item.qty, 0)} item(s) in cart
                    </p>
                  </div>
                  <Button
                    as={Link}
                    to="/checkout"
                    variant="primary"
                    size="lg"
                    className="w-100 w-md-auto"
                  >
                    Proceed to Checkout →
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;
