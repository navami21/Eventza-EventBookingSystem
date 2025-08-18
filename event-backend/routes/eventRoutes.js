const express = require('express');
const router = express.Router();
const Event = require('../model/eventData');
const { protect, adminOnly } = require('../middleware/auth');


// Admin creating events
router.post('/create', protect, adminOnly, async (req, res) => {
  const {
    title,
    description,
    location,
    startTime,
    endTime,
    calendar,
    calendarEventId,
    capacity,
    assignedController,
    price,
    image
  } = req.body;
  const parsedPrice = parseFloat(price) || 0;

  try {
    const event = await Event.create({
      title,
      description,
      location,
      startTime,
      endTime,
      calendar,
      calendarEventId,
      capacity,
      image,
      price: parsedPrice,
      isPaid: parsedPrice > 0,
      assignedController,
      availableSeats: capacity,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  const { search, date } = req.query;
  const query = {};

  if (search) {
    const regex = new RegExp(search, 'i'); // case-insensitive
    query.$or = [
      { title: regex },
      { description: regex }
    ];
  }

  if (date) {
    const selectedDate = new Date(date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    query.startTime = {
      $gte: selectedDate,
      $lt: nextDay
    };
  }

  try {
    const events = await Event.find(query).sort({ startTime: 1 });
    res.json({events});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({event});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event updated', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Controller gets their assigned events
router.get('/controller/assigned-events', protect, async (req, res) => {
  if (req.user.role !== 'controller') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const mongoose = require('mongoose');
    const controllerId = new mongoose.Types.ObjectId(req.user.id);
    const events = await Event.find({ assignedController: controllerId }).populate('assignedController', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete event (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Booking an event (user)
router.post('/book/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }
    const { seats } = req.body;
    if (event.availableSeats < seats) return res.status(400).json({ message: 'Not enough seats' });
    event.availableSeats -= seats;


    res.json({ message: 'Booking successful', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Admin assigns a controller to an event
router.post('/assign-controller/:eventId', protect, adminOnly, async (req, res) => {
  const { controllerId } = req.body;

  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.assignedController = controllerId;
    await event.save();

    res.json({ message: 'Controller assigned to event', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
