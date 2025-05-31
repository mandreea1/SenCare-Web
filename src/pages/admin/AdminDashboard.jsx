import React, { useState } from 'react';

const AdminDashboard = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    specializare: '',
    nume: '',
    prenume: '',
    telefon: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/admin/add-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: 'admin@example.com', // Înlocuiește cu emailul adminului autentificat dacă ai autentificare reală
          Email: form.email,
          password: form.password,
          specializare: form.specializare,
          nume: form.nume,
          prenume: form.prenume,
          telefon: form.telefon
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Medicul a fost adăugat cu succes!');
        setForm({
          email: '',
          password: '',
          specializare: '',
          nume: '',
          prenume: '',
          telefon: ''
        });
      } else {
        setMessage(data.error || 'Eroare la adăugare!');
      }
    } catch (err) {
      setMessage('Eroare la conectare cu serverul!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Adaugă Medic Nou</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nume:</label>
          <input
            type="text"
            name="nume"
            value={form.nume}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Prenume:</label>
          <input
            type="text"
            name="prenume"
            value={form.prenume}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Telefon:</label>
          <input
            type="text"
            name="telefon"
            value={form.telefon}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email medic:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Parolă:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Specializare:</label>
          <input
            type="text"
            name="specializare"
            value={form.specializare}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
          Adaugă Medic
        </button>
      </form>
      {message && <div style={{ marginTop: 16, color: message.includes('succes') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default AdminDashboard;