import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";

function Admin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // POST FOUND ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("place", form.place);
      formData.append("description", form.description);
      formData.append("image", selectedFile);

      await axios.post(
        "http://localhost:3001/founditems",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);
      setShowModal(false);
      setForm({ name: "", place: "", description: "" });
      setSelectedFile(null);

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  const fetchLostItems = () => {
    axios
      .get("http://localhost:3001/lostitems", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setLostItems(res.data));
  };

  const fetchClaims = () => {
    axios
      .get("http://localhost:3001/claims", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setClaims(res.data));
  };

  const updateClaim = (id, status) => {
    axios.patch(
      `http://localhost:3001/claims/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then(() => fetchClaims());
  };

  return (
  <div style={{ display: "flex" }}>
    <Sidebar role="admin" />

    <div style={{ marginLeft: "240px", width: "100%" }}>
      {/* HEADER */}
      <section
        className="text-white text-center py-5 position-relative"
        style={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)"
        }}
      >
        <div className="container">
          <h2 className="fw-bold mb-2">Admin Dashboard</h2>
          <p className="opacity-75">
            Manage found items and recovery claims
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
          className="btn btn-outline-dark btn-lg me-3 px-4"
          onClick={fetchLostItems}
        >
          View Lost Items
        </button>

        <button
          className="btn btn-outline-dark btn-lg px-4"
          onClick={fetchClaims}
        >
          View Claims
        </button>
      </div>

      {success && (
        <div className="container">
          <div className="alert alert-success text-center">
            Found item posted successfully!
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
              <input
                type="text"
                name="name"
                placeholder="Item Title"
                className="form-control mb-2"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="place"
                placeholder="Location Found"
                className="form-control mb-2"
                value={form.place}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                className="form-control mb-2"
                value={form.description}
                onChange={handleChange}
                required
              />

              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />

              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px"
                  }}
                />
              )}

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

      {/* LOST ITEMS DISPLAY */}
      <div className="container mb-5">
        <div className="row g-4">
          {lostItems.map((item) => (
            <div className="col-md-4" key={item._id}>
              <div className="p-4 rounded-4 shadow-sm bg-light h-100 hover-card">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt="Lost Item"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                  />
                )}

                <h5 className="fw-bold">{item.title}</h5>

                <p className="text-muted mb-1">
                  📍 {item.location}
                </p>

                <p className="small">{item.description}</p>

                <hr />

                <p className="small mb-1">
                  👤 {item.studentId?.name}
                </p>

                <p className="small">
                  🆔 {item.studentId?.registerNo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLAIMS DISPLAY */}
      <div className="container mb-5">
        <div className="row g-4">
          {claims.map((claim) => (
            <div className="col-md-4" key={claim._id}>
              <div className="p-4 rounded-4 shadow-sm bg-light h-100">
                <h6 className="fw-bold">
                  Found Item: {claim.foundItemId?.title}
                </h6>
                <p className="small">
                  👤 {claim.studentId?.name}
                </p>
                <p className="small">
                  Status: {claim.status}
                </p>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/admin/student/${claim.studentId._id}/history`)
                  }
                >
                  <p className="text-primary fw-bold">
                    Lost Posts: {claim.lostCount} (Click to View)
                  </p>
                </div>

                {claim.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateClaim(claim._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateClaim(claim._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </div>
  );
}

export default Admin;