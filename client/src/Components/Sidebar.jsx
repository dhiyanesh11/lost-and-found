import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h4 className="sidebar-title">
        {role === "admin" ? "Admin Panel" : "Student Panel"}
      </h4>

      {role === "student" && (
        <>
          <button onClick={() => navigate("/home")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/home#post")}>
            Post Lost Item
          </button>
          <button onClick={() => navigate("/home#found")}>
            View Found Items
          </button>
        </>
      )}

      {role === "admin" && (
        <>
          <button onClick={() => navigate("/admin")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/admin#claims")}>
            View Claims
          </button>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;