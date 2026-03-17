import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [lostRes, foundRes, claimsRes] = await Promise.all([
          axios.get("http://localhost:3001/lostitems", { headers }),
          axios.get("http://localhost:3001/founditems", { headers }),
          axios.get("http://localhost:3001/claims", { headers }),
        ]);

        if (!mounted) return;
        setLostItems(Array.isArray(lostRes.data) ? lostRes.data : []);
        setFoundItems(Array.isArray(foundRes.data) ? foundRes.data : []);
        setClaims(Array.isArray(claimsRes.data) ? claimsRes.data : []);
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load dashboard stats. Please refresh.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalStudentPosted = lostItems.length;
    const totalAdminPosted = foundItems.length;

    const approved = claims.filter((c) => c.status === "approved").length;
    const rejected = claims.filter((c) => c.status === "rejected").length;
    const pending = claims.filter((c) => c.status === "pending").length;

    const closed = approved + rejected;

    // Definitions (no backend changes):
    // - Still lost: total lost items posted by students
    // - Still not claimed: pending claims awaiting decision
    return {
      totalStudentPosted,
      totalAdminPosted,
      closed,
      stillLost: totalStudentPosted,
      stillNotClaimed: pending,
    };
  }, [claims, foundItems.length, lostItems.length]);

  return (
    <div style={{ width: "100%" }}>
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <div className="adminDash-header">
          <div>
            <h2 className="fw-bold mb-1">Admin Dashboard</h2>
            <div className="text-muted">
              Overview of platform activity and claim status.
            </div>
          </div>
          <div className="adminDash-status">
            {loading ? (
              <span className="badge">Loading…</span>
            ) : error ? (
              <span className="badge bg-danger">Offline</span>
            ) : (
              <span className="badge bg-success">Live</span>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger adminDash-alert" role="alert">
            {error}
          </div>
        )}

        <div className="row g-3 adminDash-kpis">
          <div className="col-12 col-md-6 col-xl-4">
            <div className="card p-3 hover-float adminDash-kpiCard ring">
              <div className="adminDash-kpiLabel">Items posted by students</div>
              <div className="adminDash-kpiValue">
                {loading ? "—" : stats.totalStudentPosted}
              </div>
              <div className="adminDash-kpiHint text-muted">
                Total lost items created by students.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <div className="card p-3 hover-float adminDash-kpiCard ring">
              <div className="adminDash-kpiLabel">Items posted by admin</div>
              <div className="adminDash-kpiValue">
                {loading ? "—" : stats.totalAdminPosted}
              </div>
              <div className="adminDash-kpiHint text-muted">
                Total found items posted by admin.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <div className="card p-3 hover-float adminDash-kpiCard ring">
              <div className="adminDash-kpiLabel">Closed items</div>
              <div className="adminDash-kpiValue">
                {loading ? "—" : stats.closed}
              </div>
              <div className="adminDash-kpiHint text-muted">
                Claims that were approved or rejected.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-6">
            <div className="card p-3 hover-float adminDash-kpiCard">
              <div className="adminDash-kpiRow">
                <div>
                  <div className="adminDash-kpiLabel">Still lost</div>
                  <div className="adminDash-kpiValue">
                    {loading ? "—" : stats.stillLost}
                  </div>
                </div>
                <span className="badge adminDash-pill">Lost items</span>
              </div>
              <div className="adminDash-kpiHint text-muted">
                Total lost items currently listed.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-6">
            <div className="card p-3 hover-float adminDash-kpiCard">
              <div className="adminDash-kpiRow">
                <div>
                  <div className="adminDash-kpiLabel">Still not claimed</div>
                  <div className="adminDash-kpiValue">
                    {loading ? "—" : stats.stillNotClaimed}
                  </div>
                </div>
                <span className="badge adminDash-pill">Pending</span>
              </div>
              <div className="adminDash-kpiHint text-muted">
                Pending claims awaiting admin decision.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;