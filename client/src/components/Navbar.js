// client/src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Navbar as BSNavbar, Nav, Container, Badge } from "react-bootstrap";

const AppNavbar = () => {
  const { cartItemCount } = useCart();
  const { user, logout, loading } = useAuth();

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">ShopApp</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/cart">
               Cart {cartItemCount > 0 && <Badge bg="warning" text="dark">{cartItemCount}</Badge>}
            </Nav.Link>
          </Nav>
          <Nav>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Nav.Link disabled>Hello, {user.username}</Nav.Link>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/auth/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/auth/register">Register</Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default AppNavbar;
