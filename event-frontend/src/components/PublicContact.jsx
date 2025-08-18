
import React, { useState } from 'react';
import { BsChatDotsFill } from 'react-icons/bs';
import axiosInstance from '../axiosinterceptor';
import '../css/Contact.css' 

const PublicContact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/messages/send-public', formData);
      setMessage(res.data.message);
      setFormData({ name: '', email: '', content: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    // Added 'public-contact-page' for the gradient and centering specific to this component
    <div className="public-contact-page d-flex justify-content-center align-items-center">
      <div className="public-contact-card shadow p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="text-center mb-4">
          <BsChatDotsFill size={30} className="public-contact-icon mb-2" />
          <h3>Contact Us</h3>
          <p className="text-muted">We’d love to hear from you!</p>
        </div>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Your Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Your Message</label>
            <textarea
              name="content"
              className="form-control"
              rows="4"
              placeholder="Type your message..."
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn public-contact-btn-submit">
              <i className="bi bi-send me-2"></i>Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicContact;