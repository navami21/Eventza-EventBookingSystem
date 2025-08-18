
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("No session ID found in the URL.");
      setLoading(false);
      return;
    }
    const confirmBooking = async () => {
      try {
        const res = await axiosInstance.post("/stripe/confirm-booking", { sessionId });
        const msg = res.data?.message;
    
        if (msg === "Booking confirmed") {
          console.log('booked')
        } else if (msg === "Booking already exists") {
          alert("Booking confirmed for the event. Check your email for details.");
        }
    
        setLoading(false);
    
        setTimeout(() => {
          navigate("/my-bookings");
        }, 3000);
      } catch (err) {
        console.error("Failed to confirm booking", err);
        setError(
          err.response?.data?.message || "Failed to confirm booking. Please try again."
        );
        setLoading(false);
      }
    };
    
    

    confirmBooking();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h2>Confirming your booking, please wait...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger">Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate("/my-bookings")}>
          Go to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="text-center mt-5">
      <h2 className="text-success">Payment Successful!</h2>
      <p>Redirecting to your bookings...</p>
    </div>
  );
};

export default Success;
