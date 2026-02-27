import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import "../Components/dashboard.css";

function PostFound() {
    const [form, setForm] = useState({
        title: "",
        location: "",
        description: ""
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("location", form.location);
        formData.append("description", form.description);
        formData.append("image", image);

        try {
            await axios.post("http://localhost:3001/founditems", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            alert("Found item posted successfully!");
        } catch (err) {
            alert("Failed to post found item");
        }
    };

    return (
        <>
            <Sidebar role="admin" />

            <div className="dashboard-content d-flex justify-content-center">

                <div style={{ width: "100%", maxWidth: "600px" }}>

                    <h2 className="fw-bold mb-4 text-center">
                        Post Found Item
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="card p-4 shadow-sm rounded-4"
                    >
                        <input
                            type="text"
                            name="title"
                            placeholder="Item Title"
                            className="form-control mb-3"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location Found"
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
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    background: "#f8f9fa"
                                }}
                            />
                        )}

                        <input
                            type="file"
                            className="form-control mb-3"
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                        />

                        <button className="btn btn-dark w-100">
                            Submit
                        </button>
                    </form>

                </div>

            </div>
        </>
    );
}

export default PostFound;