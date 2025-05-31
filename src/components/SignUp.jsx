import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import { ReactComponent as DoctorIcon } from '../assets/doctor-icon.svg';

const SignUp = ({ isDoctor }) => {
    if (!isDoctor) return null;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Email: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
                Email: formData.Email,
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                // Redirect to login page after successful registration
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <DoctorIcon style={{ width: 64, height: 64, color: '#3182CE' }} />
                    <div style={{ fontSize: '1.3em', color: '#2d3748', marginTop: 8, fontWeight: 600 }}>Doctor</div>
                </div>
                <h2>Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Email">Email</label>
                        <input
                            type="text"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp; 