import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

function Home() {
  const [form, setForm] = useState({
    name: "",
    place: "",
    description: "",
    date: "",
    yourname: "",
    contact: "",
    message: "",
  });

  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/lostitems", form)
      .then(() => {
        setSuccess(true);
        setForm({
          name: "",
          place: "",
          description: "",
          date: "",
          yourname: "",
          contact: "",
          message: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const getData = () => {
    axios
      .get("http://localhost:3001/getlostitems")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="container my-4">

      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Lost & Found Dashboard</h2>
        <p className="text-muted">
          Post found items or browse items reported on campus
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button
          className="btn btn-warning btn-lg"
          data-bs-toggle="modal"
          data-bs-target="#postItem"
        >
          + Post Found Item
        </button>

        <button className="btn btn-outline-dark btn-lg" onClick={getData}>
          View Lost Items
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="alert alert-success text-center">
          Item posted successfully!
        </div>
      )}

      {/* MODAL */}
      <div className="modal fade" id="postItem">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Post Found Item</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>

                {["Item name", "place", "description", "yourname", "contact", "message"].map((field) => (
                  <div className="mb-2" key={field}>
                    <input
                      type="text"
                      name={field}
                      className="form-control"
                      placeholder={field.replace(/^\w/, c => c.toUpperCase())}
                      value={form[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  data-bs-dismiss="modal"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {data.length > 0 && (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Item</th>
                <th>Place</th>
                <th>Description</th>
                <th>Date</th>
                <th>Posted By</th>
                <th>Contact</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.place}</td>
                  <td>{item.description}</td>
                  <td>{item.date}</td>
                  <td>{item.yourname}</td>
                  <td>{item.contact}</td>
                  <td>{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default Home;
