

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import '../css/UserDashboard.css';
import '../css/Navbar.css';
import { Modal, Button } from 'react-bootstrap';

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (searchDate) params.append('date', searchDate);

      const res = await axiosInstance.get(`/events?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBooking = (eventId) => {
    navigate(`/booking-form/${eventId}`);
  };

  const isExpired = (event) => {
    const end = event.endTime ? new Date(event.endTime) : new Date(event.startTime);
    return end < new Date();
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  return (
    <div className="container py-5 dashboard-container">
      <h2 className="text-center mb-4 text-primary">Available Events</h2>

      {/* Search Filters */}
      <div className="mb-4 d-flex flex-wrap gap-3 justify-content-center">
        <div className="input-group" style={{ maxWidth: '250px' }}>
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <input
          type="date"
          className="form-control"
          style={{ maxWidth: '180px' }}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        <button className="btn btn-search" onClick={fetchEvents}>
          Search
        </button>
      </div>

      {/* Event Cards */}
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {events.map((event) => {
          const expired = isExpired(event);

          return (
           <div
              key={event._id}
              className={`card shadow-sm event-card ${expired ? 'event-expired' : ''}`}
              style={{ width: '16rem', cursor: expired ? 'not-allowed' : 'pointer' }}
              onClick={() => !expired && openModal(event)}
            >

              <img
                src={event.image}
                className="card-img-top"
                alt={event.title}
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-dark text-center">{event.title}</h5>
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center text-danger mt-4">
            <h5>No events available for the selected criteria.</h5>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal show={showModal} onHide={closeModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEvent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="img-fluid mb-3 rounded"
              style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
            />
            <p>{selectedEvent.description}</p>
            <ul className="list-unstyled text-secondary">
              <li><strong>Location:</strong> {selectedEvent.location}</li>
              <li><strong>Start:</strong> {new Date(selectedEvent.startTime).toLocaleString()}</li>
              <li><strong>End:</strong> {new Date(selectedEvent.endTime).toLocaleString()}</li>
              <li><strong>Available Seats:</strong> {selectedEvent.availableSeats}</li>
              <li><strong>Entry:</strong> {selectedEvent.isPaid ? `₹${selectedEvent.price}` : 'Free'}</li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
            <Button
              variant="success"
              onClick={() => handleBooking(selectedEvent._id)}
              disabled={selectedEvent.availableSeats <= 0 || isExpired(selectedEvent)}
            >
              {isExpired(selectedEvent)
                ? 'Expired'
                : selectedEvent.availableSeats <= 0
                ? 'Sold Out'
                : 'Book Now'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserDashboard;
