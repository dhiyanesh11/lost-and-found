import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

function Claims() {
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();

  const fetchClaims = async () => {
    try {
      const res = await axios.get("http://localhost:3001/claims", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // 🔥 Sort so pending comes first
      const sorted = res.data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      });

      setClaims(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateClaim = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:3001/claims/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      fetchClaims();
    } catch (err) {
      alert("Update failed");
    }
  };

  const viewHistory = (studentId) => {
    navigate(`/admin/student/${studentId}/history`);
  };

  return (
    <>
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <h2 className="fw-bold mb-4">Claims</h2>

        <div className="row g-4">
          {claims.map((claim) => (
            <div key={claim._id} className="col-lg-4 col-md-6 col-12">
              <div className="card shadow-sm rounded-4 h-100 p-3">

                {/* IMAGE */}
                {claim.foundItemId?.imageUrl && (
                  <div
                    style={{
                      height: "200px",
                      background: "#f1f3f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      overflow: "hidden",
                      marginBottom: "12px"
                    }}
                  >
                    <img
                      src={claim.foundItemId.imageUrl}
                      alt="Found Item"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                )}

                {/* ITEM INFO */}
                <h5 className="fw-bold mb-1">
                  {claim.foundItemId?.title}
                </h5>

                <p className="small text-muted mb-1">
                  {claim.foundItemId?.description}
                </p>

                <p className="small mb-2">
                  📍 {claim.foundItemId?.location}
                </p>

                <hr />

                {/* STUDENT INFO */}
                <div className="mb-2">
                  <div className="small">
                    👤 <strong>{claim.studentId?.name}</strong>
                  </div>
                  <div className="small text-muted">
                    🎓 {claim.studentId?.registerNo}
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div className="mb-3">
                  <span
                    className={`badge ${
                      claim.status === "approved"
                        ? "bg-success"
                        : claim.status === "rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                {claim.status === "pending" && (
                  <div className="d-grid gap-2 mb-2">
                    <button
                      className="btn btn-success btn-sm"
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
                  </div>
                )}

                {/* VIEW HISTORY */}
                <button
                  className="btn btn-outline-dark btn-sm w-100"
                  onClick={() =>
                    viewHistory(claim.studentId?._id)
                  }
                >
                  View Student History
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Claims;