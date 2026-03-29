import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { NavLink } from "react-router-dom";
import "./Landing.css";

const LostAndFound = () => {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-glow" aria-hidden="true" />
        <div className="landing-hero-inner">
          <div className="container text-center">
            <div className="card ring landing-hero-panel shadow-sm">
              <div className="d-flex justify-content-center mb-3">
                <div className="landing-logo" aria-hidden="true" />
              </div>
              <div className="landing-badge">Campus Lost &amp; Found</div>
              <h1 className="landing-title display-5">
                Intelligent Lost &amp; Found System
              </h1>
              <p className="landing-lead mb-4">
                A smart digital platform to manage lost and found items efficiently.
                Post, search, and reconnect items with their rightful owners.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                <NavLink to="/login" className="btn btn-primary btn-lg px-4">
                  Get Started
                </NavLink>
                <NavLink to="/signup" className="btn btn-outline-dark btn-lg px-4">
                  Create account
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <h2 className="landing-section-title">Key Features</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card h-100 p-4 hover-float">
                <h5 className="fw-bold mb-3">Post Found Items</h5>
                <p className="text-muted mb-0">
                  Quickly submit details of found items and help others recover
                  their belongings.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-4 hover-float">
                <h5 className="fw-bold mb-3">Search &amp; Retrieve</h5>
                <p className="text-muted mb-0">
                  Browse and search through lost items using structured data
                  retrieval.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-4 hover-float">
                <h5 className="fw-bold mb-3">AI-Based Matching </h5>
                <p className="text-muted mb-0">
                  Future integration of AI to automatically suggest potential
                  matches between lost and found items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container">
          <h3 className="mb-3">Help reconnect lost items today</h3>
          <p className="mb-4">
            Join our digital initiative to make lost item recovery faster,
            smarter, and more efficient.
          </p>
          <NavLink to="/login">
            <button type="button" className="btn btn-outline-light btn-lg px-4">
              Sign in to explore
            </button>
          </NavLink>
        </div>
      </section>

      <footer className="landing-footer">
        <small>
          © {new Date().getFullYear()} Intelligent Lost &amp; Found System. All
          rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default LostAndFound;
