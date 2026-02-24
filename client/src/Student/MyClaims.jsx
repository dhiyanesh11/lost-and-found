import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const token = localStorage.getItem("token");

  const fetchClaims = async () => {
    const res = await axios.get(
      "http://localhost:3001/claims/me",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setClaims(res.data);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const cancelClaim = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3001/claims/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchClaims();
      alert("Claim cancelled");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel");
    }
  };

  return (
    <>
      <Sidebar role="student" />

      <div className="dashboard-content">
        <h2 className="fw-bold mb-4">My Claims</h2>

        <div className="row g-4">
          {claims.map((claim) => (
            <div key={claim._id} className="col-lg-4 col-md-6 col-12">
              <div className="card p-3 shadow-sm rounded-4 h-100">

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

                <h5 className="fw-bold">
                  {claim.foundItemId?.title}
                </h5>

                <p className="small text-muted mb-1">
                  {claim.foundItemId?.description}
                </p>

                <p className="small">
                  📍 {claim.foundItemId?.location}
                </p>

                <hr />

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

                {/* CANCEL BUTTON */}
                {claim.status === "pending" && (
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => cancelClaim(claim._id)}
                  >
                    Cancel Claim
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyClaims;