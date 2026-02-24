import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Home() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
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

  // POST LOST ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("place", form.place);
      formData.append("description", form.description);
      formData.append("image", selectedFile);

      await axios.post("http://localhost:3001/lostitems", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setShowModal(false);
      getData();

      setForm({
        name: "",
        place: "",
        description: "",
      });

      setSelectedFile(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  const handleClaim = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/claims",
        { foundItemId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Claim submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Claim failed");
    }
  };

  // GET FOUND ITEMS
  const getData = () => {
    axios
      .get("http://localhost:3001/founditems", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
      });
  };

  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <Sidebar role="student" />

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: window.innerWidth > 768 ? "240px" : "0",
          width: "100%",
          padding: "30px",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h3 className="fw-bold mb-4">Student Dashboard</h3>

        {/* ACTION BUTTONS */}
        <div className="mb-4">
          <button
            className="btn btn-dark me-3 px-4"
            onClick={() => setShowModal(true)}
          >
            + Post Lost Item
          </button>

          <button
            className="btn btn-outline-dark px-4"
            onClick={getData}
          >
            View Found Items
          </button>
        </div>

        {success && (
          <div className="alert alert-success">
            Lost item posted successfully!
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
                Post Lost Item
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
                  placeholder="Location Lost"
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
                  accept="image/*"
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
                      marginBottom: "10px",
                    }}
                  />
                )}

                <button type="submit" className="btn btn-dark w-100 mb-2">
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

        {/* FOUND ITEM CARDS */}
        <div className="row g-4">
          {data.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="p-4 rounded-4 shadow-sm bg-white h-100">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt="Found Item"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}

                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted mb-1">
                  📍 {item.location}
                </p>
                <p className="small">{item.description}</p>

                {item.status === "available" && (
                  <button
                    className="btn btn-success w-100 mt-2"
                    onClick={() => handleClaim(item._id)}
                  >
                    Claim This Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;