// client/src/pages/ProductDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Card, Spinner, Alert, Badge, Row, Col, InputGroup, Form } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";
import { formatPrice } from "../utils/priceFormatter";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productsAPI.getById(parseInt(id));
      setProduct(data);
    } catch (err) {
      setError(err.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const success = await addToCart(product, quantity);
    if (success) {
      setSuccess(`${product.name} added to cart!`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mt-5">
        <Alert variant="danger">
          {error || "Product not found"}
        </Alert>
        <Button as={Link} to="/products" variant="primary">
          Back to Products
        </Button>
      </div>
    );
  }

  const isInStock = product.stock_quantity > 0;

  return (
    <div className="mt-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back
      </Button>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="h2">{product.name}</Card.Title>
              {product.description && (
                <Card.Text className="mt-3">{product.description}</Card.Text>
              )}

              <div className="mt-4">
                <div className="mb-3">
                  <Badge bg={isInStock ? "success" : "danger"} className="me-2">
                    {isInStock ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
                  </Badge>
                  <span className="h4 text-primary ms-2">{formatPrice(product.price)}</span>
                </div>

                {/* Stock and Sales Information */}
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="small text-muted">Remaining in Stock</div>
                      <div className="h5 mb-0"><strong>{product.stock_quantity || 0}</strong></div>
                    </div>
                    <div className="col-6">
                      <div className="small text-muted"> Total Sold</div>
                      <div className="h5 mb-0"><strong>{product.sold_quantity || 0}</strong></div>
                    </div>
                  </div>
                </div>

                {success && (
                  <Alert variant="success" dismissible onClose={() => setSuccess("")}>
                    {success}
                  </Alert>
                )}

                <Row className="align-items-center mt-4">
                  <Col xs="auto">
                    <label className="me-2">Quantity:</label>
                    <InputGroup style={{ width: "120px" }}>
                      <Button
                        variant="outline-secondary"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={!isInStock}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={quantity}
                        min="1"
                        max={product.stock_quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(Math.min(Math.max(1, val), product.stock_quantity || 1));
                        }}
                        style={{ textAlign: "center" }}
                        disabled={!isInStock}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity || 1))}
                        disabled={!isInStock || quantity >= product.stock_quantity}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className="me-2"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/cart"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
