
import { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import jsPDF from "jspdf";
import "bootstrap-icons/font/bootstrap-icons.css";

const MyEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch bookings
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

  // Generate PDF receipt
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
    doc.text(
      `Amount Paid: ₹${booking.amountPaid || booking.eventId?.price || 0}`,
      20,
      110
    );

    doc.save(`receipt_${booking._id}.pdf`);
  };

  // Check if event is expired
  const isExpired = (booking) => {
    if (!booking.eventId) return false;
    const eventEnd = booking.eventId.endTime
      ? new Date(booking.eventId.endTime)
      : new Date(booking.eventId.startTime);
    return eventEnd < new Date();
  };

  // Filter logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.eventId?.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "free"
        ? !booking.eventId?.isPaid
        : filterStatus === "paid"
        ? booking.eventId?.isPaid && booking.paymentStatus === "paid"
        : booking.paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#5a2d82" }}>
        <i className="bi bi-calendar-event me-2"></i> My Bookings
      </h2>

      {/* Search & Filter Bar */}
      {bookings.length > 0 && (
        <div className="d-flex align-items-center mb-4 gap-3">
          <div className="search-wrapper position-relative flex-grow-1">
            <i className="bi bi-search position-absolute search-icon"></i>
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search by event title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="free">Free</option>
          </select>
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="text-center mt-5 p-5 shadow rounded bg-light">
          <h4 className="text-muted">No bookings found!</h4>
          <p className="lead mt-3">
            {search || filterStatus !== "all"
              ? "Try adjusting your search or filters."
              : "✨ It looks like you haven’t booked your first event. Start exploring and grab your seat now!"}
          </p>
          {bookings.length === 0 && (
            <a href="/user-dashboard" className="btn btn-gradient mt-3">
              Book Your First Event
            </a>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredBookings.map((booking) => (
            <div className="col-md-4 mb-4" key={booking._id}>
              <div
                className="card border-0 shadow-lg h-100 rounded-4 overflow-hidden"
                style={{ transition: "transform 0.3s" }}
              >
                <div className="card-body p-4">
                  <h5
                    className="card-title fw-bold mb-3"
                    style={{ color: "#7f55b1" }}
                  >
                    <i className="bi bi-star-fill me-2 text-warning"></i>
                    {booking.eventId?.title || "Event unavailable"}
                    {isExpired(booking) && (
                      <span className="badge bg-light text-black ms-2">Expired</span>
                    )}
                  </h5>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(booking.eventId?.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Seats:</strong> {booking.seats}
                  </p>
                  <p>
                    <strong>Booked At:</strong>{" "}
                    {new Date(booking.bookedAt).toLocaleString()}
                  </p>

                  <p>
                    <strong>Booking Status:</strong>{" "}
                    <span
                      className={`badge rounded-pill ${
                        booking.status === "booked"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>

                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={`badge rounded-pill ms-2 ${
                        booking.eventId?.isPaid
                          ? booking.paymentStatus === "paid"
                            ? "bg-success"
                            : booking.paymentStatus === "pending"
                            ? "bg-warning"
                            : "bg-danger"
                          : "bg-info"
                      }`}
                    >
                      {booking.eventId?.isPaid
                        ? booking.paymentStatus
                        : "Free Event"}
                    </span>

                    {/* Disable receipt download for expired events */}
                    {booking.eventId?.isPaid &&
                      booking.paymentStatus === "paid" &&
                      !isExpired(booking) && (
                        <button
                          className="btn btn-sm btn-light border ms-2 shadow-sm"
                          onClick={() => generateReceipt(booking)}
                          title="Download Receipt"
                        >
                          <i className="bi bi-download text-primary"></i>
                        </button>
                      )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra Styling */}
      <style>
        {`
          .btn-gradient {
            background: linear-gradient(45deg, #7f55b1, #5a2d82);
            color: white;
            border: none;
            transition: all 0.3s ease;
          }
          .btn-gradient:hover {
            background: linear-gradient(45deg, #5a2d82, #7f55b1);
            transform: scale(1.05);
          }
          .card:hover {
            transform: translateY(-5px);
          }

          /* Search input with icon */
          .search-wrapper {
            max-width: 400px;
          }
          .search-icon {
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            color: #7f55b1;
            font-size: 1.1rem;
          }

          /* Filter dropdown styling */
          .filter-select {
            min-width: 120px;
            max-width: 150px;
            border: 2px solid #7f55b1;
            border-radius: 8px;
            padding: 6px 12px;
            color: #5a2d82;
            font-weight: 500;
            background-color: #f9f7fc;
            transition: all 0.3s ease;
          }
          .filter-select:focus {
            border-color: #5a2d82;
            box-shadow: 0 0 5px rgba(127, 85, 177, 0.4);
          }
        `}
      </style>
    </div>
  );
};

export default MyEvents;
