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
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {isOpen && <div className="sidebar-overlay"></div>}

      <aside className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo" aria-hidden="true" />
            <div className="sidebar-brandText">
              <div className="sidebar-appName">Lost & Found</div>
              <div className="sidebar-role">
                {role === "admin" ? "Admin Console" : "Student Dashboard"}
              </div>
            </div>
          </div>
        </div>

        {role === "student" && (
          <>
            <NavLink to="/student/dashboard" className={linkClass}>
              <span className="sidebar-linkText">Dashboard</span>
            </NavLink>

            <NavLink to="/student/post-lost" className={linkClass}>
              <span className="sidebar-linkText">Post Lost Item</span>
            </NavLink>

            <NavLink to="/student/found-items" className={linkClass}>
              <span className="sidebar-linkText">View Found Items</span>
            </NavLink>

            <NavLink to="/student/my-claims" className={linkClass}>
              <span className="sidebar-linkText">My Claims</span>
            </NavLink>
            

            {/* 🔔 Notifications */}
            <NavLink to="/student/notifications" className={linkClass}>
              <span className="sidebar-linkText">Notifications</span>
              {unreadCount > 0 && <span className="sidebar-badge">{unreadCount}</span>}
            </NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <NavLink to="/admin/dashboard" className={linkClass}>
              <span className="sidebar-linkText">Dashboard</span>
            </NavLink>

            <NavLink to="/admin/post-found" className={linkClass}>
              <span className="sidebar-linkText">Post Found Item</span>
            </NavLink>

            <NavLink to="/admin/lost-items" className={linkClass}>
              <span className="sidebar-linkText">View Lost Items</span>
            </NavLink>

            <NavLink to="/admin/claims" className={linkClass}>
              <span className="sidebar-linkText">View Claims</span>
            </NavLink>
          </>
        )}

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;