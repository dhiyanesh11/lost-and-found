import React from "react";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function AdminDashboard() {
  return (
    <div style={{  width: "100%" }}>
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <h2 className="fw-bold mb-4">Admin Dashboard</h2>

        <div className="card p-4 shadow-sm rounded-4">
          <h5>Welcome, Admin 👋</h5>
          <p className="text-muted">
            Use the sidebar to manage found items, lost items and claims.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;