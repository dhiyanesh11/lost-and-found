import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/* PUBLIC */
import LostAndFound from "./Components/LostAndFound";
import Login from "./Login";
import Signup from "./Signup";

/* ADMIN */
import AdminDashboard from "./Admin/AdminDashboard";
import PostFound from "./Admin/PostFound";
import AdminLostItems from "./Admin/AdminLostItems";
import Claims from "./Admin/Claims";
import StudentHistory from "./Admin/StudentHistory";

/* STUDENT */
import StudentDashboard from "./Student/StudentDashboard";
import PostLost from "./Student/PostLost";
import FoundItems from "./Student/FoundItems";
import MyClaims from "./Student/MyClaims";

/* =========================
   ROLE-BASED PROTECTION
========================= */
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (role && decoded.role !== role) {
      return <Navigate to="/" />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<LostAndFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= STUDENT ROUTES ================= */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/post-lost"
          element={
            <ProtectedRoute role="student">
              <PostLost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/found-items"
          element={
            <ProtectedRoute role="student">
              <FoundItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-claims"
          element={
            <ProtectedRoute role="student">
              <MyClaims />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/post-found"
          element={
            <ProtectedRoute role="admin">
              <PostFound />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lost-items"
          element={
            <ProtectedRoute role="admin">
              <AdminLostItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/claims"
          element={
            <ProtectedRoute role="admin">
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student/:id/history"
          element={
            <ProtectedRoute role="admin">
              <StudentHistory />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;