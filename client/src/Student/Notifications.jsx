import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const res = await axios.get(
          "http://localhost:3001/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data);

      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }

    };

    fetchNotifications();

  }, [token]);

  const openModal = (notification) => {
    console.log(notification.foundItemId);
    setSelectedItem(notification.foundItemId);
    setShowModal(true);
  };
  const claimItem = async () => {

    try {

      await axios.post(
        "http://localhost:3001/claim-item",
        { itemId: selectedItem._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Claim request sent!");
      setShowModal(false);

    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div style={{ display: "flex" }}>
      <Sidebar role="student" />
      <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>

        <h3 className="mb-4">🔔 Notifications</h3>

        {notifications.map((n) => (

          <div key={n._id} className="card shadow-sm mb-3">

            <div className="card-body">

              <div className="d-flex justify-content-between">

                <h6>Possible Match Found</h6>

                <span className="badge bg-success">
                  {n.matchScore}% Match
                </span>

              </div>

              <p className="text-muted">
                {n.message}
              </p>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => openModal(n)}
              >
                View Item
              </button>

              <div className="text-muted mt-2" style={{ fontSize: "12px" }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>

            </div>

          </div>

        ))}

        <Modal show={showModal} onHide={() => setShowModal(false)}>

          <Modal.Header closeButton>
            <Modal.Title>Found Item Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedItem && (
              <>
                {selectedItem?.imageUrl && (
                  <img
                    src={selectedItem.imageUrl}
                    alt="item"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                )}

                <p><b>Title:</b> {selectedItem.title}</p>
                <p><b>Description:</b> {selectedItem.description}</p>
                <p><b>Location:</b> {selectedItem.location}</p>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>

            <Button variant="success" onClick={claimItem}>
              Claim Item
            </Button>

            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>

          </Modal.Footer>

        </Modal>
      </div>

    </div>

  );

}

export default Notifications;