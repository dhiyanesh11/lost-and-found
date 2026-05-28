import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import API_URL from "./config";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    registerNo: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const surfaceRef = useRef(null);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const handlePointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    // Subtle interactive glow following cursor.
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/login`, form);
      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      if (decoded.role === "admin") navigate("/admin/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={surfaceRef} className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <div className="login-card-wrap">
        <div className="card ring login-card p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="login-logo" aria-hidden="true" />
            <div>
              <h3 className="mb-0 fw-bold">Lost & Found Sign In</h3>
              <div className="text-muted" style={{ fontSize: "0.95rem" }}>
                Your account routes you to the right dashboard.
              </div>
            </div>
          </div>

          {error && (
            <div className="alert login-alert" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <label className="form-label" htmlFor="registerNo">
              Register Number
            </label>
            <input
              id="registerNo"
              type="text"
              name="registerNo"
              placeholder="RA..."
              className="form-control mb-3"
              value={form.registerNo}
              onChange={handleChange}
              required
              autoComplete="off"
            />

            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="login-password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="form-control mb-3"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.58 10.58a2 2 0 002.83 2.83"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.88 5.08A10.94 10.94 0 0112 5c7 0 10 7 10 7a21.47 21.47 0 01-3.52 4.52"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.12 6.12A21.47 21.47 0 004 12s3 7 10 7a10.94 10.94 0 002.12-.2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 login-submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Loggning in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Don't have an account?{" "}
              <Link to="/signup" className="login-link">
                Sign up
              </Link>
            </small>
          </div>

          <div className="text-center mt-2">
            <Link to="/" className="text-decoration-none login-back">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
