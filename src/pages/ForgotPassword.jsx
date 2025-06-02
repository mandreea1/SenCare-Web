import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`,
        data: { email },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      setIsError(false);
      setMessage('Email-ul de resetare a fost trimis cu succes!');
      
      // Adăugăm redirecționare automată după 3 secunde
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Eroare:', err);
      setIsError(true);
      if (err.response?.status === 404) {
        setMessage('Nu există cont cu acest email.');
      } else {
        setMessage('A apărut o eroare. Vă rugăm încercați din nou.');
      }
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
            {!isError && <p>Veți fi redirecționat la pagina de login în câteva secunde...</p>}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Se procesează...' : 'Trimite email de resetare'}
        </button>
        
        <div className="login-link">
          <a href="/login">Înapoi la login</a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;