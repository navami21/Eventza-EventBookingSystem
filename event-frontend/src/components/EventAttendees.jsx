import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosinterceptor';
import { useParams, useNavigate } from 'react-router-dom';

const EventAttendees = () => {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      setLoading(true);
      try {
        const [eventRes, attendeesRes] = await Promise.all([
          axiosInstance.get(`/events/${eventId}`), 
          axiosInstance.get(`/bookings/controller/attendees/${eventId}`)
        ]);
        setEvent(eventRes.data);
        setAttendees(attendeesRes.data.attendees);
      } catch (err) {
        console.error(err);
        setError('Failed to load event or attendees');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndAttendees();
  }, [eventId]);

  const handleCheckIn = async (bookingId) => {
    try {
      await axiosInstance.patch(`/bookings/${bookingId}/checkin`);
      setAttendees((prev) =>
        prev.map((a) => (a._id === bookingId ? { ...a, status: 'check-in' } : a))
      );
    } catch (err) {
      console.error(err);
      setError('Check-in failed');
    }
  };

  return (
    <div className="container my-4">
      <h3 style={{paddingBottom:'20px'}}>Attendees</h3>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="mb-3">{event ? event.title : 'Event Details'}</h2>

      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {attendees.length === 0 ? (
        <p>No attendees yet.</p>
      ) : (
        <ul className="list-group">
          {attendees.map((attendee) => (
            <li
              key={attendee._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                {attendee.userId
                  ? `${attendee.userId.name} (${attendee.userId.email}) - `
                  : 'Unknown User - '}
                <strong>{attendee.status}</strong>
              </div>
              {attendee.status !== 'check-in' && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleCheckIn(attendee._id)}
                >
                  Check In
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventAttendees;
