import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RegisterForm from "./RegisterForm";

const PageLayout = () => {
  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row>
        <Col>
          {/* Content */}
          <div className="text-center">
            <RegisterForm />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Footer */}
          <footer className="text-center">
            <p></p>
          </footer>
        </Col>
      </Row>
    </Container>
  );
};

export default PageLayout;
