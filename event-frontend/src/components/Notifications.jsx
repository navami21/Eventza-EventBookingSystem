
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosinterceptor';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/messages/notifications');
      setMessages(res.data);
    } catch {
      // handle error (optional: show alert or log)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-primary fw-bold text-center mb-4">Notifications</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading notifications...</p>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-muted text-center">No notifications available.</p>
      ) : (
        <ul className="list-group">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className={`list-group-item border-0 shadow-sm mb-3 rounded ${
                msg.read ? 'bg-light text-muted' : 'bg-white fw-semibold'
              }`}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-dark">
                  From: <strong>{msg.sender?.name}</strong>{' '}
                  <span className="badge bg-secondary ms-1">{msg.sender?.role}</span>
                </small>
                <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
              </div>
              <p className="mb-1">{msg.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
