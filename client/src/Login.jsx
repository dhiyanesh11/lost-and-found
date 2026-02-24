import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    registerNo: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/login", form)


      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);

        if (decoded.role === "admin") {
  navigate("/admin/dashboard");
} else {
  navigate("/student/dashboard");
}
        
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Login failed");
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
        <h3 className="text-center mb-4 fw-bold">Student Login</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="registerNo"
            placeholder="Register Number"
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
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </small>
        </div>

        <div className="text-center mt-2">
          <Link to="/" className="text-decoration-none">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
