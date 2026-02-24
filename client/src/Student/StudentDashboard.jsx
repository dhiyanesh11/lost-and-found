import React from "react";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function StudentDashboard() {
  return (
    <div style={{  width: "100%" }}>
      <Sidebar role="student" />

      <div className="dashboard-content">
        <h2 className="fw-bold mb-4">Student Dashboard</h2>

        <div className="card p-4 shadow-sm rounded-4">
          <h5>Welcome 👋</h5>
          <p className="text-muted">
            Use the sidebar to post lost items and claim found items.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;