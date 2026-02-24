import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function FoundItems() {
  const [items, setItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch found items
  const fetchItems = async () => {
    const res = await axios.get("http://localhost:3001/founditems", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data);
  };

  // Fetch my claims
  const fetchMyClaims = async () => {
    const res = await axios.get("http://localhost:3001/claims/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMyClaims(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchMyClaims();
  }, []);

  const claimItem = async (id) => {
    try {
      await axios.post(
        "http://localhost:3001/claims",
        { foundItemId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMyClaims(); // refresh claim state
      alert("Claim submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Already claimed");
    }
  };

  // Helper: check if current user already claimed
  const isClaimed = (itemId) => {
    return myClaims.some(
      (claim) => claim.foundItemId?._id === itemId
    );
  };

  return (
    <>
      <Sidebar role="student" />

      <div className="dashboard-content">
        <h2 className="fw-bold mb-4">Found Items</h2>

        <div className="row g-4">
          {items.map((item) => {
            const claimed = isClaimed(item._id);

            return (
              <div key={item._id} className="col-lg-4 col-md-6 col-12">
                <div className="card p-3 shadow-sm rounded-4 h-100">

                  {/* IMAGE */}
                  {item.imageUrl && (
                    <div
                      style={{
                        height: "200px",
                        background: "#f1f3f5",
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
                        alt="Found Item"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  )}

                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="small text-muted">
                    {item.description}
                  </p>
                  <p className="small">📍 {item.location}</p>

                  {/* CLAIM BUTTON */}
                  {claimed ? (
                    <button
                      className="btn btn-secondary w-100 mt-2"
                      disabled
                    >
                      Claimed
                    </button>
                  ) : (
                    item.status === "available" && (
                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={() => claimItem(item._id)}
                      >
                        Claim
                      </button>
                    )
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FoundItems;