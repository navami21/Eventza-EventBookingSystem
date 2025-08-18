import React from 'react';
import '../css/About.css'; 

const About = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
       
        <div className="col-md-6 mb-4 mb-md-0">
  <div id="aboutCarousel" className="carousel slide shadow rounded-4" data-bs-ride="carousel">
    <div className="carousel-inner rounded-4">
      <div className="carousel-item active">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D"
          className="d-block w-100 img-fluid"
          alt="Event 1"
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://professional.dce.harvard.edu/wp-content/uploads/sites/9/2022/09/how-to-choose-a-pdp.jpg"
          className="d-block w-100 img-fluid"
          alt="Event 2"
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://cdn.prod.website-files.com/634e7aa49f5b025e1fd9e87b/652039f6d6eec22bc94097d5_Man_Having_Group_Videoconference_On_Laptop.jpeg"
          className="d-block w-100 img-fluid"
          alt="Event 3"
        />
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</div>

        <div className="col-md-6">
          <h2 className="fw-bold text-primary mb-3">About Eventza</h2>
          <p className="text-muted">
            <strong>Eventza</strong> is a smart event booking platform designed to simplify and enhance the event experience. Whether it's a concert, webinar, or conference, Eventza provides seamless booking, real-time updates, and secure check-ins — all in one place.
          </p>
          <ul className="list-unstyled mt-3">
            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2" ></i> Book and manage events with ease</li>
            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Instant QR code & calendar links</li>
            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Admin & Controller roles for smooth operations</li>
            <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Secure payments and booking confirmations</li>
          </ul>
          <p className="mt-4">
            Join us in transforming the way events are organized and experienced!
          </p>
          <div className="mt-4">
  <h5 className="fw-bold mb-3">Follow us on</h5>
  <div className="d-flex gap-3 fs-3 icon-color">
    <i className="bi bi-facebook bi1" style={{ cursor: 'pointer' }}></i>
    <i className="bi bi-twitter bi2" style={{ cursor: 'pointer' }}></i>
    <i className="bi bi-instagram b13" style={{ cursor: 'pointer' }}></i>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default About;
