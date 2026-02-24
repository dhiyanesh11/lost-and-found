import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function PostLost() {
  const [form, setForm] = useState({
    name: "",
    place: "",
    description: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // GLOBAL PASTE LISTENER
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;

      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          setImage(file);
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("place", form.place);
    formData.append("description", form.description);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:3001/lostitems", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Lost item posted!");
      setImage(null);
    } catch {
      alert("Failed to post lost item");
    }
  };

  return (
    <>
      <Sidebar role="student" />

      <div className="dashboard-content d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <h2 className="fw-bold mb-4 text-center">
            Post Lost Item
          </h2>

          <form
            onSubmit={handleSubmit}
            className="card p-4 shadow-sm rounded-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Item Title"
              className="form-control mb-3"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="place"
              placeholder="Location Lost"
              className="form-control mb-3"
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              className="form-control mb-3"
              rows="4"
              onChange={handleChange}
              required
            />

            {/* DRAG & DROP AREA */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
                marginBottom: "15px",
                background: "#f8f9fa"
              }}
            >
              <p className="mb-2">
                📎 Drag & Drop or Paste Image (Ctrl + V)
              </p>

              <input
                type="file"
                style={{ display: "none" }}
                id="fileInput"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <label
                htmlFor="fileInput"
                className="btn btn-outline-dark btn-sm"
              >
                Browse Files
              </label>
            </div>

            {/* IMAGE PREVIEW */}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  background: "#fff"
                }}
              />
            )}

            <button className="btn btn-dark w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PostLost;