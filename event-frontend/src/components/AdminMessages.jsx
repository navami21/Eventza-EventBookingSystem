import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosinterceptor';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get('/messages/user-messages');
      setMessages(res.data);
    } catch {
      setError('Failed to fetch messages');
    }
  };

  const handleReplyChange = (userId, value) => {
    setReplyContent(prev => ({ ...prev, [userId]: value }));
  };

  const sendReply = async (userId) => {
    try {
      await axiosInstance.post(`/messages/send-to-user/${userId}`, {
        content: replyContent[userId]
      });
      setReplyContent(prev => ({ ...prev, [userId]: '' }));
      alert('Reply sent');
    } catch {
      alert('Failed to send reply');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary fw-bold">User Messages</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {messages.length === 0 ? (
        <p className="text-muted text-center">No messages found.</p>
      ) : (
        messages.map(msg => (
          <div
            key={msg._id}
            className="card mb-4 shadow-sm border-0"
            style={{ borderLeft: '5px solid #6f42c1', borderRadius: '10px' }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    From:{' '}
                    <span className="text-dark fw-semibold">
                      {msg.sender
                        ? `${msg.sender.name} (${msg.sender.email})`
                        : `${msg.name || 'Anonymous'} (${msg.email || 'No email'})`}
                    </span>
                    {msg.sender?.role === 'controller' && (
                      <span className="badge bg-info text-dark ms-2">Controller</span>
                    )}
                  </h5>
                </div>
                <small className="text-muted">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </div>

              <hr />
              <p className="fst-italic text-dark">{msg.content}</p>

              {msg.sender ? (
                <>
                  <textarea
                    className="form-control mt-3"
                    rows="3"
                    placeholder={`Reply to ${msg.sender.name}`}
                    value={replyContent[msg.sender._id] || ''}
                    onChange={(e) =>
                      handleReplyChange(msg.sender._id, e.target.value)
                    }
                  />
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-outline-primary mt-2"
                      style={{ backgroundColor: '#7f55b1', color:'white',border:'none' }}
                      disabled={!replyContent[msg.sender._id]}
                      onClick={() => sendReply(msg.sender._id)}
                    >
                      <i className="bi bi-send me-1"></i>Send Reply
                    </button>
                  </div>
                </>
              ) : (
                <div className="alert alert-secondary mt-3 mb-0">
                  This is a public message from a guest. You cannot reply directly.
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMessages;
