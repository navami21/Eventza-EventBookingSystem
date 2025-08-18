
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import '../css/EventForm.css'


const EventForm = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    capacity: '',
    image:'',
    assignedController: '',
    isPaid: false,
    price: 0,
    
  });
  const [error, setError] = useState('');
  const isValidImageUrl = (url) => {
    return /\.(jpg|png)$/i.test(url);
  };
  
  const fetchEvent = async () => {
    try {
      const res = await axiosInstance.get(`/events/${eventId}`);
      const {event} = res.data;
      setForm({
        title: event.title,
        description: event.description,
        location: event.location,
        startTime: event.startTime.slice(0, 16),
        endTime: event.endTime.slice(0, 16),
        capacity: event.capacity,
        image:event.image,
        assignedController: event.assignedController ? event.assignedController._id || event.assignedController : '',
        availableSeats:event.availableSeats ||0,
        isPaid: event.isPaid || false,
        price: event.price || 0,
      });
    } catch (err) {
      setError('Failed to load event data');
    }
  };
  const [controllerList, setControllerList] = useState([]);

useEffect(() => {
  const fetchControllers = async () => {
    try {
      const res = await axiosInstance.get('/users/controllers');
      setControllerList(res.data);
    } catch (err) {
      console.error('Failed to fetch controllers');
    }
  };
  const init = async () => {
    fetchControllers();
    if (eventId) await fetchEvent();
  };

  init();
}, [eventId]);

 

  const handleChange = (e) =>{
    const { name, value } = e.target;

  if (name === 'image' && value && !isValidImageUrl(value)) {
    setError('Only JPG and PNG image URLs are allowed');
  } else {
    setError('');
  }
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isValidImageUrl(form.image)) {
      setError('Only JPG and PNG image URLs are allowed');
      return;
    }
  
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        isPaid: form.isPaid === "true" || form.isPaid === true,
      };
  
      const { availableSeats, ...rest } = payload;
  
      if (eventId) {
        await axiosInstance.put(`/events/${eventId}`, rest);
        alert('Event updated');
      } else {
        await axiosInstance.post('/events/create', rest);
        alert('Event created');
      }
  
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Failed to submit event');
    }
  };
  

  return (
    <>
   
    <div className="container my-5 event-form-container">
      <div className="card shadow-lg">
        <div className="card-header  text-white "sx={{color:'white'}}>
          <h3 className="mb-0 text-center" >{eventId ? 'Edit Event' : 'Create Event'}</h3>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-2">
            <div className="col-md-6">
            <label className="form-label">Title</label>
            <input type="text" name="title" className="form-control form-control-sm" value={form.title}
        onChange={handleChange}
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">Location</label>
      <input
        type="text"
        name="location"
        className="form-control form-control-sm"
        value={form.location}
        onChange={handleChange}
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">Start Time</label>
      <input
        type="datetime-local"
        name="startTime"
        className="form-control form-control-sm"
        value={form.startTime}
        onChange={handleChange}
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">End Time</label>
      <input
        type="datetime-local"
        name="endTime"
        className="form-control form-control-sm"
        value={form.endTime}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Image URL</label>
      <input
        type="text"
        name="image"
        className="form-control form-control-sm"
        value={form.image}
        onChange={handleChange}
        required
      />
    </div>


    <div className="col-md-6">
      <label className="form-label">Capacity</label>
      <input
        type="number"
        name="capacity"
        className="form-control form-control-sm"
        value={form.capacity}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
  <label className="form-label">Payment Type</label>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="isPaid"
      value={true}
      checked={form.isPaid === true || form.isPaid === "true"}
      onChange={() => setForm({ ...form, isPaid: true })}
    />
    <label className="form-check-label">Paid</label>
  </div>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="isPaid"
      value={false}
      checked={form.isPaid === false || form.isPaid === "false"}
      onChange={() => setForm({ ...form, isPaid: false, price: 0 })}
    />
    <label className="form-check-label">Free</label>
  </div>
</div>

{form.isPaid && (
  <div className="col-md-6">
    <label className="form-label">Price (₹)</label>
    <input
      type="number"
      className="form-control form-control-sm"
      name="price"
      value={form.price}
      onChange={handleChange}
      min="1"
      required={form.isPaid}
    />
  </div>
)}

    {eventId && (
                  <div className="col-md-6">
                    <label className="form-label">Available Seats</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={form.availableSeats}
                      readOnly
                    />
                  </div>
                )}

    <div className="col-md-6">
      <label className="form-label">Assign Controller</label>
      <select
        className="form-select form-select-sm"
        name="assignedController"
        value={form.assignedController || ''}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Controller --</option>
        {controllerList.map((ctrl) => (
          <option key={ctrl._id} value={ctrl._id}>
            {ctrl.name} ({ctrl.email})
          </option>
        ))}
      </select>
    </div>

    <div className="col-12">
      <label className="form-label">Description</label>
      <textarea
        name="description"
        className="form-control form-control-sm"
        rows="2"
        value={form.description}
        onChange={handleChange}
      />
    </div>
  </div>

  <div className="mt-3 text-end">
    <button type="submit" className="btn-event btn-sm px-4">
      {eventId ? 'Update Event' : 'Create Event'}
    </button>
  </div>
</form>

        </div>
      </div>
    </div>
    </>
  );
};

export default EventForm;
