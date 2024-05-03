import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    textChange: "Sign In",
  });
  const { email, password, username, textChange } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          email,
          username,
          password,
        }
      );
      navigate("/login");
      // Redirect or handle successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div>
        <h1 className="text-center mb-4">QuickChat</h1>
        <h3 className="text-center mb-4">Register</h3>
        <form className="mx-auto max-w-xs relative " onSubmit={handleSubmit}>
          <div>
            <input
              style={{
                width: "100%",
                padding: "12px 20px",
                margin: "8px 0",
                boxSizing: "border-box",
              }}
              type="username"
              placeholder="Username"
              onChange={handleChange("username")}
              value={username}
            />
          </div>
          <div>
            <input
              style={{
                width: "100%",
                padding: "12px 20px",
                margin: "8px 0",
                boxSizing: "border-box",
              }}
              type="email"
              placeholder="Email"
              onChange={handleChange("email")}
              value={email}
            />
          </div>

          <div>
            <input
              style={{
                width: "100%",
                padding: "12px 20px",
                margin: "8px 0",
                boxSizing: "border-box",
              }}
              type="password"
              placeholder="Password"
              onChange={handleChange("password")}
              value={password}
            />
          </div>
          <div>
            <Button type="submit">
              <i className="fas fa-sign-in-alt  w-6  -ml-2" />
              <span className="ml-3">Sign Up</span>
            </Button>
          </div>
          {/* <Link
            to="/users/password/forget"
            className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
          >
            Forget password?
          </Link> */}
        </form>
        <div>Already have an account?</div>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default RegisterForm;
