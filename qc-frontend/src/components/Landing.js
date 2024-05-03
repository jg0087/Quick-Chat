import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <h1 className="text-center mb-4">QuickChat</h1>
            <p className="lead text-center mb-4">
              QuickChat is your go-to online platform for fast and efficient
              text messaging. Connect with friends, family, and colleagues
              instantly and stay connected wherever you go!
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
              className="text-center"
            >
              <Link to="/login">
                <Button variant="primary" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" className="mr-2">
                  Register
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
