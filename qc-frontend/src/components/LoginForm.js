import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    textChange: "Sign In",
  });
  const { email, password, textChange } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("loggedInUser", email);
      // Redirect to '/home'
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setErrors({ invalidCredentials: "Invalid email or password" });
      } else {
        setErrors({
          serverError: "An error occurred. Please try again later.",
        });
      }
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div>
        <h1 className="text-center mb-4">QuickChat</h1>
        <h3 className="text-center mb-4">Login</h3>
        <form className="" style={{ width: "100%" }} onSubmit={handleSubmit}>
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

          {errors.invalidCredentials && (
            <div className="text-red-500">{errors.invalidCredentials}</div>
          )}
          <div>
            <Button type="submit">
              <i className="fas fa-sign-in-alt  w-6  -ml-2" />
              <span className="ml-3">Sign In</span>
            </Button>
          </div>

          {/* <Link
            to="/users/password/forget"
            className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
          >
            Forget password?
          </Link> */}
        </form>
        <div>Don't have an account?</div>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default LoginForm;
