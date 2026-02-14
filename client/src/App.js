import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LostAndFound from "./Components/LostAndFound";
import Home from "./Components/Home";
import Login from "./Login";
import Signup from "./Signup";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LostAndFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
