import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function StudentHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (url) => {
        setSelectedImage(url);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `http://localhost:3001/admin/students/${id}/lost-items`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setData(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchHistory();
    }, [id]);

    return (
        <div className="container mt-5">
            <h3>Student Lost Item History</h3>

            {data.length === 0 ? (
                <p>No lost posts found.</p>
            ) : (
                data.map((item) => (
                    <div key={item._id} className="card p-3 mb-3 shadow-sm">
                        <div className="row align-items-center">

                            {/* LEFT SIDE - TEXT */}
                            <div className="col-md-9">
                                <h5>{item.name}</h5>
                                <p className="mb-1">{item.description}</p>
                                <p className="mb-1 text-muted">📍 {item.place}</p>

                                <p>
                                    Status:{" "}
                                    <span
                                        className={`fw-bold ${item.status === "open"
                                                ? "text-warning"
                                                : "text-success"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </p>

                                <small>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </small>
                            </div>

                            {/* RIGHT SIDE - SMALL IMAGE */}
                            <div className="col-md-3 text-end">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt="Lost Item"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => openImage(item.imageUrl)}
                                    />
                                )}
                            </div>

                        </div>
                    </div>
                ))
            )}
            {selectedImage && (
  <div
    onClick={closeImage}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
  >
    <img
      src={selectedImage}
      alt="Full View"
      style={{
        maxWidth: "80%",
        maxHeight: "80%",
        borderRadius: "10px",
        boxShadow: "0 0 20px rgba(255,255,255,0.3)"
      }}
    />
  </div>
)}

            <button
                className="btn btn-secondary mt-3"
                onClick={() => navigate(-1)}
            >
                Back
            </button>
        </div>
    );
}

export default StudentHistory;