// client/src/pages/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { productsAPI } from "../services/api";
import { formatPrice } from "../utils/priceFormatter";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      // Show only first 3 products on home page
      setProducts(data.slice(0, 3));
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to ShopApp</h1>
      <p className="lead">Discover our amazing products!</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {products.length === 0 ? (
        <Alert variant="info">
          No products available. <Link to="/products">Browse all products</Link>
        </Alert>
      ) : (
        <>
          <Row>
            {products.map((p) => (
              <Col key={p.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Text>{p.description}</Card.Text>
                    <Card.Text className="fw-bold">{formatPrice(p.price)}</Card.Text>
                    <Button as={Link} to={`/products/${p.id}`} variant="primary">
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/products">
              <Button variant="info" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
