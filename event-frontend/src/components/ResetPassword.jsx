
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosinterceptor';
import '../css/Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('login-bg');
    return () => {
      document.body.classList.remove('login-bg');
    };
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (!token) { 
      setMessage('Password reset token is missing from the URL.');
      return;
    }


    setLoading(true);
    try {
      await axiosInstance.post('/users/forgot-password/reset', {
        token,
        newPassword,
      });

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow login-card">

            <h3 className="text-center mb-4">Reset Password</h3>

            {message && (
              <div
                className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}
                role="alert"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
                style={{ backgroundColor: '#7f55b1', border: 'none' }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
