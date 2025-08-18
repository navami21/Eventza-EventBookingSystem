// import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosinterceptor';
import { useNavigate } from 'react-router-dom';
import '../css/EventForm.css';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [pendingControllers, setPendingControllers] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingControllers, setLoadingControllers] = useState(false);
  const [error, setError] = useState('');
  const [showControllers, setShowControllers] = useState(false); // ⬅️ Toggle state

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

  const approveController = async (id) => {
    try {
      await axiosInstance.post(`/users/approve-controller/${id}`);
      fetchPendingControllers();
    } catch (err) {
      setError('Failed to approve controller');
    }
  };

  const rejectController = async (id) => {
    if (window.confirm('Are you sure you want to reject this controller?')) {
      try {
        await axiosInstance.delete(`/users/reject-controller/${id}`);
        fetchPendingControllers();
      } catch (err) {
        setError('Failed to reject controller');
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPendingControllers();
  }, []);
  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/events/${id}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
    } catch (error) {
      setError('Failed to delete event');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPendingControllers();
  }, []);

  // ... your return JSX, where you have
  // onClick={() => deleteEvent(event._id)} for the Delete button

  return (
    <div className="container my-4 text-dark">
      <h1 className="mb-4">Admin Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Events Section */}
        <div className="col-md-7 mb-4">
          <h2>All Events</h2>
          {loadingEvents ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="list-group">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="list-group-item list-group-item-action flex-column align-items-start"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5>{event.title}</h5>
                    <small>{new Date(event.startTime).toLocaleString()}</small>
                  </div>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="img-fluid mb-2"
                      style={{
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                    />
                  )}
                  <p>{event.description}</p>
                  <p>Capacity: {event.capacity}</p>
                  <small>Location: {event.location}</small>
                  <div>
                  <small>Payment: {event.isPaid ? `₹${event.price}` : 'Free'}</small>
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/events/${event._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => deleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="col-md-5 mb-4">
        <div className="d-flex justify-content-end">
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowControllers(!showControllers)}
    >
      {showControllers ? 'Hide Pending Controllers' : 'Show Pending Controllers'}
        </button>
        </div>


          {/* Toggle Section */}
          {showControllers && (
            <>
              <h2>Pending Controllers</h2>
              {loadingControllers ? (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-border text-secondary" role="status" />
                </div>
              ) : pendingControllers.length === 0 ? (
                <p>No pending controllers.</p>
              ) : (
                <ul className="list-group">
                  {pendingControllers.map((controller) => (
                    <li
                      key={controller._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {controller.name} <br />
                        <small className="text-muted">{controller.email}</small>
                      </div>
                      <div>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => approveController(controller._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => rejectController(controller._id)}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
