import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";

function Sidebar({ role }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3001/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    if (role === "student") {
      fetchNotifications();
    }
  }, [role, token]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".hamburger-container")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <div className="hamburger-container d-md-none">
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {isOpen && <div className="sidebar-overlay"></div>}

      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <h4 className="sidebar-title">
          {role === "admin" ? "Admin Panel" : "Student Panel"}
        </h4>

        {role === "student" && (
          <>
            <NavLink to="/student/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/student/post-lost" className={linkClass}>
              Post Lost Item
            </NavLink>

            <NavLink to="/student/found-items" className={linkClass}>
              View Found Items
            </NavLink>

            <NavLink to="/student/my-claims" className={linkClass}>
              My Claims
            </NavLink>
            

            {/* 🔔 Notifications */}
            <NavLink to="/student/notifications" className={linkClass}>
              Notifications
              {unreadCount > 0 && (
                <span className="badge bg-danger ms-2">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <NavLink to="/admin/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/post-found" className={linkClass}>
              Post Found Item
            </NavLink>

            <NavLink to="/admin/lost-items" className={linkClass}>
              View Lost Items
            </NavLink>

            <NavLink to="/admin/claims" className={linkClass}>
              View Claims
            </NavLink>
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