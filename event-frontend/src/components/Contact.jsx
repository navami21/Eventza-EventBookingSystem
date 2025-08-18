import React, { useState } from 'react';
import axiosInstance from '../axiosinterceptor';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import '../css/Contact.css'
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/messages/send', formData);
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', content: '' });
    } catch (err) {
      setStatus({ type: 'danger', message: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow p-4 rounded-4">
          <h3 className="head1 mb-4 text-center">
  <i className="bi bi-chat-dots-fill me-2" style={{ color: '#7F55B1' }}></i>
  Contact Us
</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="content">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  rows={5}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button className='btn-contact' variant="primary" type="submit">Send Message</Button>
              </div>

              {status.message && (
                <Alert className="mt-3" variant={status.type}>
                  {status.message}
                </Alert>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
