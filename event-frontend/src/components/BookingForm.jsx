import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import confetti from 'canvas-confetti';

const BookingForm = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosInstance.get(`/events/${eventId}`);
        setEvent(res.data.event);
      } catch (err) {
        setError('Failed to load event');
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event || seats < 1) return;

    try {
      if (event.isPaid) {
        navigate(`/payment/${event._id}?seats=${seats}`);
      } else {
        await axiosInstance.post(`/bookings/${event._id}`, { seats });
        setShowModal(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          setShowModal(false);
          navigate('/my-bookings');
        }, 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="mb-4 text-dark text-center">Book {event.title}</h3>
        <h6 className="mb-4 text-dark text-center">Event: {event.description}</h6>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Event Time</label>
            <p>{new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}</p>
          </div>

          <div className="mb-3">
            <label htmlFor="seats" className="form-label">Number of Seats</label>
            <input
              type="number"
              id="seats"
              className="form-control"
              value={seats}
              min="1"
              max={event.availableSeats}
              onChange={(e) => setSeats(e.target.value)}
              required
            />
          </div>

          {event.isPaid && (
            <div className="mb-3">
              <p><strong>Total:</strong> ₹{event.price * seats}</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-success w-100 mb-2">
            {event.isPaid ? 'Proceed to Payment' : 'Book Now'}
          </button>

          <button type="button" onClick={handleGoBack} className="btn btn-secondary w-100">
            Go Back
          </button>
        </form>
      </div>

      {showModal && (
        <div className="modal d-block text-center" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-white"  style={{ backgroundColor: '#7f55b1' }}>
                <h5 className="modal-title">🎉 Booking Confirmed!</h5>
              </div>
              <div className="modal-body">
                <p>You’ve successfully booked <strong>{event.title}</strong>!</p>
                <p>Check your email for confirmation. Loading...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
