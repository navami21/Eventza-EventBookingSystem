
import { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import jsPDF from "jspdf";
import "bootstrap-icons/font/bootstrap-icons.css";

const MyEvents = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/bookings/my");
        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };
    fetchBookings();
  }, []);

  const generateReceipt = (booking) => {
    const doc = new jsPDF();

    const eventTitle = booking.eventId?.title || "Event Title";
    const eventDate = new Date(booking.eventId?.startTime).toLocaleString();
    const bookedAt = new Date(booking.bookedAt).toLocaleString();

    doc.setFontSize(16);
    doc.text("Event Booking Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking._id}`, 20, 40);
    doc.text(`Event: ${eventTitle}`, 20, 50);
    doc.text(`Event Date: ${eventDate}`, 20, 60);
    doc.text(`Booked At: ${bookedAt}`, 20, 70);
    doc.text(`Seats: ${booking.seats}`, 20, 80);
    doc.text(`Status: ${booking.status}`, 20, 90);
    doc.text(`Payment Status: ${booking.paymentStatus}`, 20, 100);
    doc.text(`Amount Paid: ₹${booking.amountPaid || booking.eventId?.price || 0}`, 20, 110);

    doc.save(`receipt_${booking._id}.pdf`);
  };

  return (
    <div className="container text-dark mt-5">
      <h2 className="text-center mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center mt-5">
          <h4 className="text-muted">No bookings yet!</h4>
          <p className="lead">
            ✨ It looks like you haven’t booked your first event. Start exploring and grab your seat now!
          </p>
          <a href="/user-dashboard" className="btn btn-primary mt-3">
            Book Your First Event
          </a>
        </div>
      ) : (
        <div className="row">
          {bookings.map((booking) => (
            <div className="col-md-4 mb-4" key={booking._id}>
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#7f55b1' }}>
                    {booking.eventId?.title || "Event unavailable"}
                  </h5>
                  <p><strong>Date:</strong> {new Date(booking.eventId?.startTime).toLocaleString()}</p>
                  <p><strong>Seats:</strong> {booking.seats}</p>
                  <p><strong>Booked At:</strong> {new Date(booking.bookedAt).toLocaleString()}</p>
                  <p><strong>Booking Status:</strong>
                    <span className={`badge ${booking.status === 'booked' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                      {booking.status}
                    </span>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span className={`badge ms-2 ${
                      booking.eventId?.isPaid
                        ? (booking.paymentStatus === 'paid' ? 'bg-success' :
                          booking.paymentStatus === 'pending' ? 'bg-warning' : 'bg-danger')
                        : 'bg-info'
                    }`}>
                      {booking.eventId?.isPaid ? booking.paymentStatus : 'Free Event'}
                    </span>

                    {booking.eventId?.isPaid && booking.paymentStatus === 'paid' && (
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        style={{ padding: '2px 6px', fontSize: '1rem', lineHeight: '1' }}
                        onClick={() => generateReceipt(booking)}
                        title="Download Receipt"
                      >
                        <i className="bi bi-download"></i>
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;

