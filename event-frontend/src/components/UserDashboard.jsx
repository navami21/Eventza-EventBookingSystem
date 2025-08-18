import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import '../css/UserDashboard.css';
import '../css/Navbar.css'

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
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

  return (
    <div className="container py-5 dashboard-container">
      <h2 className="text-center mb-4 ">Available Events</h2>

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

  {/* Date Picker */}
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

      <div className="d-flex flex-wrap justify-content-center gap-4">
  {events.map((event) => (
    <div
      key={event._id}
      className="card shadow-sm event-card"
    >
      <img
        src={event.image}
        className="card-img-top event-card-img"
        alt={event.title}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-dark">{event.title}</h5>
        <p className="card-text text-muted flex-grow-1">
          {event.description.length > 100
            ? `${event.description.slice(0, 100)}...`
            : event.description}
        </p>
        <ul className="list-unstyled text-secondary small mb-3">
          <li><strong>Location:</strong> {event.location}</li>
          <li><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</li>
          <li><strong>End:</strong> {new Date(event.endTime).toLocaleString()}</li>
          <li><strong>Available Seats:</strong> {event.availableSeats}</li>
          <li><strong>Entry:</strong> {event.isPaid ? `₹${event.price}` : 'Free'}</li>
        </ul>
        <button
          onClick={() => handleBooking(event._id)}
          disabled={event.availableSeats <= 0}
          className={`btn ${event.availableSeats <= 0 ? 'btn-secondary disabled' : 'btn-success'}`}
        >
          {event.availableSeats <= 0 ? 'Sold Out' : 'Book Now'}
        </button>
      </div>
    </div>
  ))}

  {events.length === 0 && (
    <div className="text-center text-danger mt-4">
      <h5>No events available for the selected criteria.</h5>
    </div>
  )}
</div>

      </div>
    
  );
};

export default UserDashboard;
