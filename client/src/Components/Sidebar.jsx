import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ role }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // auto close on mobile
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <div className="d-md-none p-3">
        <button
          className="btn btn-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <h4 className="sidebar-title">
          {role === "admin" ? "Admin Panel" : "Student Panel"}
        </h4>

        {role === "student" && (
          <>
            <button onClick={() => handleNavigate("/home")}>
              Dashboard
            </button>
            <button onClick={() => handleNavigate("/student/post-lost")}>
              Post Lost Item
            </button>
            <button onClick={() => handleNavigate("/student/found-items")}>
              View Found Items
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <button onClick={() => handleNavigate("/admin")}>
              Dashboard
            </button>
            <button onClick={() => handleNavigate("/admin/claims")}>
              View Claims
            </button>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;