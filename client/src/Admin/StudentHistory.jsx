import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

function StudentHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/admin/students/${id}/lost-items`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [id]);

  return (
    <>
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Student Lost Item History</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {items.length === 0 ? (
          <p>No lost posts found.</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="card p-3 mb-3 shadow-sm rounded-4"
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap">

                {/* LEFT SIDE CONTENT */}
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <h5 className="fw-bold">{item.title}</h5>

                  <p className="text-muted mb-1">
                    📍 {item.location}
                  </p>

                  <p>{item.description}</p>

                  <span
                    className={`badge ${
                      item.status === "open"
                        ? "bg-warning text-dark"
                        : item.status === "matched"
                        ? "bg-info"
                        : "bg-success"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="mt-2 text-muted small">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* RIGHT SIDE IMAGE */}
                {item.imageUrl && (
                  <div
                    style={{
                      width: "120px",
                      height: "90px",
                      marginLeft: "20px",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                    <img
                      src={item.imageUrl}
                      alt="Lost Item"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* IMAGE POPUP */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3000
            }}
          >
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "10px"
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default StudentHistory;