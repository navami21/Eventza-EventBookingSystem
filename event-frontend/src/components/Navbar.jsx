
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const username = user?.name || 'Profile';
  const isAuthenticated = !!localStorage.getItem('logintoken');

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(() => {
    const stored = localStorage.getItem('hasUnreadNotifications');
    return stored === null ? true : JSON.parse(stored);
  });

  useEffect(() => {
    localStorage.setItem('hasUnreadNotifications', JSON.stringify(hasUnreadNotifications));
  }, [hasUnreadNotifications]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    setHasUnreadNotifications(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 text-white shadow-lg py-3" style={{ minHeight: '70px' }}>
      <Link className="navbar-brand d-flex align-items-center" to={isAuthenticated ? (role === 'admin' ? '/admin-dashboard' : '#') : '/'}>
        {/* <img
          src="/images/logo2.png"
          alt="Eventza Logo"
          style={{ height: '40px', objectFit: 'contain', marginRight: '10px' }}
        /> */}
        <span className="logo-font">Eventza</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="mainNavbar">
        <ul className="navbar-nav ms-auto align-items-center">

          {/* Public Links */}
          {!isAuthenticated && (
            <>
              <li className="nav-item me-3">
                <Link className="nav-link text-white" to="/about">About</Link>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link text-white" to="/public-contact">Contact</Link>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link text-white" to="/login">Login</Link>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link text-white" to="/signup">Sign Up</Link>
              </li>
            </>
          )}

          {/* Authenticated User Links */}
          {isAuthenticated && (
            <>
              {role === 'admin' && (
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white" to="/admin-dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white" to="/events/create">Create Event</Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white" to="/admin-messages">User messages</Link>
                  </li>
                </>
              )}

              {role === 'controller' && (
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white" to="/controller-dashboard">Assigned Events</Link>
                  </li>
                  <li className="nav-item me-3 position-relative">
                    <Link className="nav-link text-white" to="/controller/notifications" onClick={handleNotificationsClick}>
                      <i className="bi bi-bell" style={{ fontSize: '1.2rem' }}></i>
                      {hasUnreadNotifications && (
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                      )}
                    </Link>
                  </li>
                </>
              )}

              {role === 'user' && (
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white fw-bold" to="/user-dashboard">Events</Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white fw-bold" to="/my-bookings">My Bookings</Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link className="nav-link text-white fw-bold" to="/contact">Contact</Link>
                  </li>
                  <li className="nav-item me-3 position-relative">
                    <Link className="nav-link text-white fw-bold" to="/notifications" onClick={handleNotificationsClick}>
                      <i className="bi bi-bell" style={{ fontSize: '1.2rem' }}></i>
                      {hasUnreadNotifications && (
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                      )}
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item dropdown ms-3">
                <a className="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle fs-5 me-1"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="dropdown-item-text">
                    <strong>{username}</strong>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center drop-logout-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


