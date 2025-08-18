// import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const seats = query.get("seats");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosInstance.get(`/events/${eventId}`);
        setEvent(res.data.event);
      } catch (err) {
        setError("Failed to fetch event data");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handlePayment = async () => {
    if (!event) return;

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/stripe/create-checkout-session", {
        eventId,
        eventTitle: event.title,
        seats: Number(seats),
        amount: event.price
      });

      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // go back to the previous page
  };

  if (!event) return <div>Loading event details...</div>;

  const totalAmount = event.price * seats;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form
        className="card shadow-lg p-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h2 className="mb-4 text-center text-primary">Payment Summary</h2>

        <div className="mb-3">
          <label className="form-label">Event</label>
          <input
            type="text"
            className="form-control"
            value={event.title}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Number of Seats</label>
          <input
            type="text"
            className="form-control"
            value={seats}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price per Seat</label>
          <input
            type="text"
            className="form-control"
            value={`₹${event.price}`}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Amount</label>
          <input
            type="text"
            className="form-control"
            value={`₹${totalAmount}`}
            readOnly
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
