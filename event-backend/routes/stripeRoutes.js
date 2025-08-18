
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/auth');
const User = require('../model/userData');
const Booking = require('../model/bookingData');
const bookEvent = require('../utils/bookEvent');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post('/create-checkout-session', protect, async (req, res) => {
  const { eventId, eventTitle, seats, amount } = req.body;
  const user = req.user;

  try {
    const existing = await Booking.findOne({
      eventId,
      userId: user._id,
      paymentStatus: 'paid'
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already booked this event.' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/event/${eventId}`,
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: 'inr',
          unit_amount: amount * 100,
          product_data: { name: eventTitle },
        },
        quantity: seats,
      }],
      metadata: {
        userId: user._id.toString(),
        eventId: eventId.toString(),
        seats: seats.toString()
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ message: 'Stripe checkout session creation failed' });
  }
});

router.post('/confirm-booking', protect, async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const eventId = session.metadata.eventId;
    const seats = parseInt(session.metadata.seats, 10);

    // Fetch user document once
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if booking already exists
    const existing = await Booking.findOne({ eventId, userId: user._id, paymentStatus: 'paid' });
    if (existing) {
      return res.status(200).json({ message: 'Booking already exists', booking: existing });
    }

    const isPaidNow = session.payment_status === 'paid';

    const booking = await bookEvent({ eventId, user, seats, skipEmail: false, isPaidNow: true });

    booking.paymentStatus = 'paid';
    await booking.save();

    res.status(200).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    console.error("Stripe session verification failed:", err.message);
    res.status(400).json({ message: 'Invalid or expired session ID' });
  }
});

module.exports = router;
