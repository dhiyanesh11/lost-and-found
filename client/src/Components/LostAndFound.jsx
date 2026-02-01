import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { NavLink } from "react-router-dom";

const LostAndFound = () => {
  return (
    <div>

      {/* HERO SECTION */}
      <header className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Lost & Found Portal</h1>
          <p className="lead mt-3">
            A centralized platform to help students report lost items and return found belongings.
          </p>

          <div className="mt-4">
            {/* Home stays the main page */}
            <NavLink to="/home">
              <button className="btn btn-warning btn-lg">
                Get Started
              </button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold">How it works</h2>
            <p className="mt-3">
              Students can submit details of lost items, post items they have found,
              and browse available listings to recover their belongings quickly and
              securely within the campus community.
            </p>
          </div>

          <div className="col-md-6 text-center">
            <img
              src="https://i0.wp.com/lost-found.org/wp-content/uploads/lost-and-found-service.png?resize=768%2C458&ssl=1"
              className="img-fluid rounded shadow"
              alt="Lost and Found illustration"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center">

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Report Lost Items</h5>
                  <p className="card-text">
                    Easily submit lost item details and check recent found items.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Post Found Items</h5>
                  <p className="card-text">
                    Found something on campus? Post it to help return it to its owner.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Search & Recover</h5>
                  <p className="card-text">
                    Browse listings and quickly match lost items with found ones.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          © {new Date().getFullYear()} Lost & Found System | College Project
        </p>
      </footer>

    </div>
  );
};

export default LostAndFound;
