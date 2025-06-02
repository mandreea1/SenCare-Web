import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Parolele nu coincid');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reset-password`, {
        token,
        password
      });
      
      setMessage('Parola a fost resetată cu succes!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.error || 'A apărut o eroare. Vă rugăm încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Resetare parolă</h2>
        
        <div className="form-group">
          <label htmlFor="password">Parolă nouă:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmă parola:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Se procesează...' : 'Resetează parola'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;