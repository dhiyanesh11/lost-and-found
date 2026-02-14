import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    registerNo: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/signup", form)
      .then(() => {
        alert("Account created successfully!");
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Signup failed");
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)"
      }}
    >
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4 fw-bold">
          College Registration
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-control mb-3"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="registerNo"
            placeholder="Register Number (RA...)"
            className="form-control mb-3"
            value={form.registerNo}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-dark w-100">
            Create Account
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already registered?{" "}
            <Link to="/login">Login</Link>
          </small>
        </div>

        <div className="text-center mt-2">
          <Link to="/" className="text-decoration-none">
            ← Back to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
