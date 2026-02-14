import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place: "",
    description: "",
    date: "",
    yourname: "",
    contact: "",
    message: "",
  });

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(
      "http://localhost:3001/lostitems",
      form,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then(() => {
        setSuccess(true);
        setShowModal(false);
        getData();
        setForm({
          name: "",
          place: "",
          description: "",
          date: "",
          yourname: "",
          contact: "",
          message: "",
        });
      })
      .catch(err => console.log(err));
  };

  const getData = () => {
    axios.get("http://localhost:3001/getlostitems")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>

      {/* HEADER */}
      <section
        className="text-white text-center py-5 position-relative"
        style={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)"
        }}
      >
        <div className="container">
          <h2 className="fw-bold mb-2">Lost & Found Dashboard</h2>
          <p className="opacity-75">
            Manage and track lost items efficiently
          </p>

          <button
            className="btn btn-danger position-absolute top-0 end-0 m-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="container text-center my-5">
        <button
          className="btn btn-dark btn-lg me-3 px-4"
          onClick={() => setShowModal(true)}
        >
          + Post Found Item
        </button>

        <button
          className="btn btn-outline-dark btn-lg px-4"
          onClick={getData}
        >
          View Items
        </button>
      </div>

      {success && (
        <div className="container">
          <div className="alert alert-success text-center">
            Item posted successfully!
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="bg-white p-4 rounded-4 shadow"
            style={{ width: "400px" }}
          >
            <h5 className="mb-3 text-center fw-bold">
              Post Found Item
            </h5>

            <form onSubmit={handleSubmit}>
              {Object.keys(form).map((key) =>
                key !== "date" ? (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    placeholder={key.toUpperCase()}
                    className="form-control mb-2"
                    value={form[key]}
                    onChange={handleChange}
                    required
                  />
                ) : null
              )}

              <input
                type="date"
                name="date"
                className="form-control mb-3"
                value={form.date}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-dark w-100 mb-2"
              >
                Submit
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ITEM CARDS */}
      <div className="container mb-5">
        <div className="row g-4">
          {data.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div
                className="p-4 rounded-4 shadow-sm bg-light h-100"
              >
                <h5 className="fw-bold">{item.name}</h5>
                <p className="text-muted mb-1">
                  📍 {item.place}
                </p>
                <p className="small">{item.description}</p>
                <hr />
                <p className="small mb-1">
                  🗓 {item.date}
                </p>
                <p className="small mb-1">
                  👤 {item.yourname}
                </p>
                <p className="small">
                  📞 {item.contact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;
