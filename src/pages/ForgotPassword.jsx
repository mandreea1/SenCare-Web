import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, { email });
    setIsError(false);
    setMessage(response.data.message || 'Email-ul a fost trimis cu succes!');
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
        <p>Introduceți adresa de email pentru a primi instrucțiuni de resetare a parolei.</p>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Se procesează...' : 'Trimite email de resetare'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;