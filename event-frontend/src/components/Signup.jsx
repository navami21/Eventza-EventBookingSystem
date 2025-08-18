import axiosInstance from '../axiosinterceptor';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/Signup.css'
const Signup = () => {
  const [activeTab, setActiveTab] = useState('user');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setError('');
    setMessage('');
  };

  const handleUserSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosInstance.post('/users/signup', {
        name,
        email,
        password,
        securityQuestion,
        securityAnswer,
      });

      localStorage.setItem('logintoken', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        role: data.user.role
    }));
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleControllerSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosInstance.post('/users/controller/signup', {
        name,
        email,
        password,
      });

      resetForm();
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };
  useEffect(() => {
    document.body.classList.add('signup-bg');
    return () => {
      document.body.classList.remove('signup-bg');
    };
  }, []);
  return (
    <div
      className="signup-container d-flex justify-content-center align-items-center"
      
    >
      <div className="signup-card card p-5 shadow-lg rounded-4 signup-bg" style={{ maxWidth: '550px', width: '100%' }}>
      <h2 className="text-center mb-4 text-primary fw-bold">Welcome to Eventza</h2>  
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('user');
                resetForm();
              }}
            >
              User Signup
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'controller' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('controller');
                resetForm();
              }}
            >
              Controller Signup
            </button>
          </li>
        </ul>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={activeTab === 'user' ? handleUserSignup : handleControllerSignup}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {activeTab === 'user' && (
            <>
              <div className="mb-3">
                <select
                  className="form-control"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  required
                >
                  <option value="">Select a security question</option>
                  <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                  <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                  <option value="What city were you born in?">What city were you born in?</option>
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-success w-100">
            {activeTab === 'user' ? 'Sign Up as User' : 'Sign Up as Controller'}
          </button>
        </form>

        <div className="text-center mt-1">
          <a href="/login" className="text-decoration-none">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;