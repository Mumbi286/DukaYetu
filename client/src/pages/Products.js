// client/src/pages/Products.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Alert, Spinner, Badge, Toast, ToastContainer } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";
import { formatPrice } from "../utils/priceFormatter";

const Products = () => {
  const { addToCart, error: cartError } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    // Check stock before adding
    if ((product.stock_quantity || 0) <= 0) {
      setError("Product is out of stock");
      return;
    }

    setAddingToCart(product.id);
    setError(""); // Clear previous errors
    const success = await addToCart(product, 1);

    if (success) {
      setAddedProduct(product);
      setShowToast(true);
    } else {
      // Error message will be set by CartContext
    }
    setAddingToCart(null);
  };

  const displayError = error || cartError;

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error && !products.length) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="mt-4">
      <h1 className="mb-4">Our Products</h1>

      {displayError && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {displayError}
        </Alert>
      )}

      {products.length === 0 ? (
        <Alert variant="info">No products available</Alert>
      ) : (
        <Row>
          {products.map((p) => {
            const isInStock = p.stock_quantity > 0;
            const isAdding = addingToCart === p.id;

            return (
              <Col key={p.id} md={4} lg={3} className="mb-4">
                <Card
                  className="h-100 shadow-sm"
                  style={{ cursor: isInStock && !isAdding ? "pointer" : "default" }}
                  onClick={(e) => {
                    // Only add to cart if clicking the card body, not buttons
                    if (isInStock && !isAdding && e.target.closest('.card-body') && !e.target.closest('button') && !e.target.closest('a')) {
                      handleAddToCart(p);
                    }
                  }}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5">{p.name}</Card.Title>
                    {p.description && (
                      <Card.Text className="text-muted small flex-grow-1">
                        {p.description.length > 100
                          ? `${p.description.substring(0, 100)}...`
                          : p.description}
                      </Card.Text>
                    )}

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-primary mb-0">{formatPrice(p.price)}</span>
                        <Badge bg={isInStock ? "success" : "danger"}>
                          {isInStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>

                      {/* Stock and Sales Information */}
                      <div className="mb-2 small text-muted">
                        <div className="d-flex justify-content-between">
                          <span>In Stock: <strong>{p.stock_quantity || 0}</strong></span>
                          <span>Sold: <strong>{p.sold_quantity || 0}</strong></span>
                        </div>
                      </div>

                      {isInStock && p.stock_quantity < 10 && (
                        <Alert variant="warning" className="py-1 px-2 mb-2 small">
                          Only {p.stock_quantity} left!
                        </Alert>
                      )}

                      <div className="d-grid gap-2">
                        <Button
                          variant="success"
                          onClick={() => handleAddToCart(p)}
                          disabled={!isInStock || isAdding}
                          size="sm"
                        >
                          {isAdding ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              Add to Cart
                            </>
                          )}
                        </Button>
                        <Button
                          as={Link}
                          to={`/products/${p.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Success Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {addedProduct && `${addedProduct.name} added to cart!`}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Products;
