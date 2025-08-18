const express = require('express');
const router = express.Router();
const { protect,controllerOnly,adminOnly } = require('../middleware/auth');
const Event = require('../model/eventData');
const Booking = require('../model/bookingData');
const bookEvent = require('../utils/bookEvent');

// Book a FREE event (no payment required)
router.post('/:eventId', protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seats } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.isPaid) {
      return res.status(400).json({ message: 'Paid event. Please complete payment to book.' });
    }

    const booking = await bookEvent({ eventId, user: req.user, seats });
    res.status(200).json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// View user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('eventId')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your bookings' });
  }
});
router.patch('/:id/checkin', protect, controllerOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'check-in';
    await booking.save();
    res.json({ message: 'User successfully checked in', booking });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /controller/attendees/:eventId
router.get('/controller/attendees/:eventId', protect, async (req, res) => {
  if (req.user.role !== 'controller') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event || event.assignedController.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not assigned to this event' });
    }

    const bookings = await Booking.find({ eventId: req.params.eventId })
      .populate('userId', 'name email')
      .select('-qrcode');

    res.json({ attendees: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/admin/bad-bookings', protect, adminOnly, async (req, res) => {
  try {
    const badBookings = await Booking.find({ userId: null });
    res.json({ count: badBookings.length, badBookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bad bookings' });
  }
});

//DELETE /api/admin/bad-bookings 
router.delete('/admin/bad-bookings', protect, adminOnly, async (req, res) => {
  try {
    const result = await Booking.deleteMany({ userId: null });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bad bookings' });
  }
});
module.exports = router;
