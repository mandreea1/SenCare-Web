import React, { useState } from 'react';
import '../styles/AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment Data:', formData);
    // TODO: Add API call to save appointment
  };

  return (
    <div className="appointment-form">
      <h3>Schedule an Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe the reason for your appointment..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Schedule Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm; 