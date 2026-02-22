import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { NavLink } from "react-router-dom";

const LostAndFound = () => {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      
      {/* HERO SECTION */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          padding: "80px 0",
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">
            Intelligent Lost & Found System
          </h1>
          <p className="lead mb-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
            A smart digital platform to manage lost and found items efficiently. 
            Post, search, and reconnect items with their rightful owners.
          </p>

          <NavLink to="/home">
            <button className="btn btn-light btn-lg px-4 py-2 fw-semibold shadow">
              Get Started
            </button>
          </NavLink>
          
          
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Key Features</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div
                className="p-4 bg-white rounded-4 shadow-sm h-100"
                style={{ transition: "0.3s" }}
              >
                <h5 className="fw-bold mb-3">Post Found Items</h5>
                <p className="text-muted">
                  Quickly submit details of found items and help others recover
                  their belongings.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 bg-white rounded-4 shadow-sm h-100"
                style={{ transition: "0.3s" }}
              >
                <h5 className="fw-bold mb-3">Search & Retrieve</h5>
                <p className="text-muted">
                  Browse and search through lost items using structured data
                  retrieval.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 bg-white rounded-4 shadow-sm h-100"
                style={{ transition: "0.3s" }}
              >
                <h5 className="fw-bold mb-3">AI-Based Matching (Upcoming)</h5>
                <p className="text-muted">
                  Future integration of AI to automatically suggest potential
                  matches between lost and found items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="py-5 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #2a5298, #1e3c72)",
        }}
      >
        <div className="container">
          <h3 className="fw-bold mb-3">
            Help reconnect lost items today
          </h3>
          <p className="mb-4">
            Join our digital initiative to make lost item recovery faster,
            smarter, and more efficient.
          </p>

          <NavLink to="/home">
            <button className="btn btn-outline-light btn-lg px-4">
              Explore Now
            </button>
          </NavLink>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2025 Intelligent Lost & Found System. All Rights Reserved.</small>
      </footer>
    </div>
  );
};

export default LostAndFound;
