

import axiosInstance from '../axiosinterceptor';
import { useNavigate } from 'react-router-dom';
import '../css/EventForm.css';
import '../css/AdminDashboard.css';
import { useEffect, useState } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [pendingControllers, setPendingControllers] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingControllers, setLoadingControllers] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showControllerModal, setShowControllerModal] = useState(false);
  const [selectedController, setSelectedController] = useState(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    setError('');
    try {
      const res = await axiosInstance.get('/events');
      setEvents(res.data.events);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchPendingControllers = async () => {
    setLoadingControllers(true);
    setError('');
    try {
      const res = await axiosInstance.get('/users/pending-controllers');
      setPendingControllers(res.data);
    } catch (err) {
      setError('Failed to fetch pending controllers');
    } finally {
      setLoadingControllers(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedController) return;
    try {
      await axiosInstance.post(`/users/approve-controller/${selectedController._id}`);
      setShowControllerModal(false);
      fetchPendingControllers();
    } catch (err) {
      setError('Failed to approve controller');
    }
  };

  const handleReject = async () => {
    if (!selectedController) return;
    if (!window.confirm('Are you sure you want to reject this controller?')) return;
    try {
      await axiosInstance.delete(`/users/reject-controller/${selectedController._id}`);
      setShowControllerModal(false);
      fetchPendingControllers();
    } catch (err) {
      setError('Failed to reject controller');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axiosInstance.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPendingControllers();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpired = (eventDate) => new Date(eventDate) < new Date();

  return (
    <div className="container my-4 text-dark">
      <h1 className="mb-4 text-center">Admin Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Events Section */}
        <div className="col-lg-8 col-md-12 mb-4">
          <h2 className="mb-3">All Events</h2>

          <div className="input-group mb-4 shadow-sm rounded">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loadingEvents ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <p className="text-muted">No events found.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
              {filteredEvents.map((event) => (
                <div key={event._id} className="col">
                  <div
                    className={`card shadow-sm h-100 hover-card ${isExpired(event.startTime) ? 'expired-card' : ''}`}
                    onClick={() => { setSelectedEvent(event); setShowEventModal(true); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {event.image && (
                      <img
                        src={event.image}
                        className="card-img-top event-img"
                        alt={event.title}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title d-flex justify-content-between align-items-center">
                        {event.title} {isExpired(event.startTime) && <span className="badge bg-danger">Expired</span>}
                      </h5>
                      <p className="text-muted mb-1">{new Date(event.startTime).toLocaleString()}</p>
                      <p className="card-text flex-grow-1">{event.description.substring(0, 100)}...</p>
                      <div className="d-flex mt-auto">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}/edit`); }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => { e.stopPropagation(); deleteEvent(event._id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Controllers */}
        <div className="col-lg-4 col-md-12 mb-4">
          <h2 className="mb-3">Pending Controllers</h2>
          {loadingControllers ? (
            <div className="d-flex justify-content-center my-3">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          ) : pendingControllers.length === 0 ? (
            <p className="text-muted">No pending controllers.</p>
          ) : (
            <ul className="list-group">
              {pendingControllers.map((controller) => (
                <li
                  key={controller._id}
                  className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 rounded"
                >
                  <div>
                    <strong>{controller.name}</strong> <br />
                    <small className="text-muted">{controller.email}</small>
                  </div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setSelectedController(controller);
                      setShowControllerModal(true);
                    }}
                  >
                    Action
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {/* Event Details Modal */}
<Modal
  show={showEventModal}
  onHide={() => setShowEventModal(false)}
  size="lg"
  centered
>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>
      <i className="bi bi-calendar-event me-2"></i>Event Details
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedEvent && (
      <div className="row">
        {/* Left side - image */}
        <div className="col-md-5 text-center mb-3 mb-md-0">
          {selectedEvent.image ? (
            <img
              src={selectedEvent.image}
              className="img-fluid rounded shadow-sm"
              alt={selectedEvent.title}
              style={{ maxHeight: "260px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded shadow-sm"
              style={{ height: "260px" }}
            >
              <i className="bi bi-image text-muted" style={{ fontSize: "2rem" }}></i>
            </div>
          )}
        </div>

        {/* Right side - details */}
        <div className="col-md-7">
          <h4 className="fw-bold mb-2 d-flex align-items-center">
            {selectedEvent.title}
            {isExpired(selectedEvent.startTime) && (
              <span className="badge bg-danger ms-2">Expired</span>
            )}
          </h4>

          <ul className="list-unstyled mb-3">
            <li className="mb-2">
              <i className="bi bi-clock text-primary me-2"></i>
              <strong>Date & Time:</strong>{" "}
              {new Date(selectedEvent.startTime).toLocaleString()}
            </li>
            <li className="mb-2">
              <i className="bi bi-geo-alt text-primary me-2"></i>
              <strong>Location:</strong> {selectedEvent.location}
            </li>
            <li className="mb-2">
              <i className="bi bi-people text-primary me-2"></i>
              <strong>Capacity:</strong> {selectedEvent.capacity}
            </li>
            <li className="mb-2">
              <i className="bi bi-currency-rupee text-primary me-2"></i>
              <strong>Payment:</strong>{" "}
              {selectedEvent.isPaid ? `₹${selectedEvent.price}` : "Free"}
            </li>
          </ul>

          <div
            className="p-3 bg-light rounded border"
            style={{ maxHeight: "130px", overflowY: "auto" }}
          >
            <p className="mb-0">
              <strong>Description:</strong> <br />
              {selectedEvent.description}
            </p>
          </div>
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer className="bg-light">
    <Button variant="secondary" onClick={() => setShowEventModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


      {/* Controller Modal */}
      <Modal show={showControllerModal} onHide={() => setShowControllerModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Controller Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedController && (
            <div>
              <p>Do you want to approve or reject the controller?</p>
              <p>
                <strong>{selectedController.name}</strong> <br />
                <small>{selectedController.email}</small>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleReject}>Reject</Button>
          <Button variant="success" onClick={handleApprove}>Approve</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
