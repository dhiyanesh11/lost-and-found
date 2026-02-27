import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function AdminLostItems() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/lostitems", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => setItems(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <Sidebar role="admin" />

            <div className="dashboard-content">
                <h2 className="fw-bold mb-4">Lost Items</h2>

                <div className="row g-4">
                    {items.map((item) => (
                        <div key={item._id} className="col-lg-4 col-md-6 col-12">
                            <div className="card p-3 shadow-sm rounded-4 h-100">

                                {/* IMAGE */}
                                {item.imageUrl && (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            backgroundColor: "#f8f9fa",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt="Lost Item"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "100%",
                                                objectFit: "contain"
                                            }}
                                        />
                                    </div>
                                )}

                                {/* ITEM INFO */}
                                <h5 className="fw-bold">{item.title}</h5>
                                <p>{item.description}</p>
                                <p className="text-muted">📍 {item.location}</p>

                                <hr />

                                {/* STUDENT INFO */}
                                <p className="mb-1">
                                    👤 <strong>{item.studentId?.name}</strong>
                                </p>
                                <p className="text-muted">
                                    🎓 {item.studentId?.registerNo}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminLostItems;