const QRCode = require('qrcode');
const Booking = require('../model/bookingData');
const Event = require('../model/eventData');
const sendEmail = require('./sendEmail');


const bookEvent = async ({ eventId, user, seats,isPaidNow = false, skipEmail = false }) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');
  if (event.availableSeats < seats) {
    throw new Error('Not enough seats available');
  }

  event.availableSeats -= seats;
  await event.save();
  const amount = event.price * seats;  
  const booking = await Booking.create({
    userId: user._id,
    eventId: eventId,
    seats,
    status: 'booked',
    paymentStatus: event.isPaid ? (isPaidNow ? 'paid' : 'pending') : 'paid',
    amountPaid: amount
  });

  if (!event.isPaid || !skipEmail) {
    const qrCodeData = `Booking ID: ${booking._id}\nEvent: ${event.title}\nUser: ${user.name}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    booking.qrcode = qrCodeImage;
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime.toISOString().replace(/-|:|\.\d\d\d/g, '')}/${endTime.toISOString().replace(/-|:|\.\d\d\d/g, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    await booking.save();

    await sendEmail({
      to: user.email,
      subject: `Booking Confirmed for ${event.title}`,
      user,
      event,
      seats,
      qrcode: qrCodeImage,
      calendarLink
    });
  }

  return booking;
};

module.exports = bookEvent;
