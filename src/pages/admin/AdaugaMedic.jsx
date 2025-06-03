import React, { useState } from 'react';
import axios from 'axios';

function AdaugaMedic() {
  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    specializare: '',
    parola: '',
  });
  const [loading, setLoading] = useState(false);
  const [mesaj, setMesaj] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMesaj('');
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      await axios.post(`${BACKEND_URL}/api/admin/add-doctor`, form);
      setMesaj('✅ Medicul a fost adăugat cu succes!');
      setForm({
        nume: '',
        prenume: '',
        email: '',
        telefon: '',
        specializare: '',
        parola: '',
      });
    } catch (err) {
      setMesaj('❌ Eroare la adăugare medic!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adauga-medic-container" style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Adaugă medic</h2>
      <form className="adauga-medic-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="nume">Nume</label>
          <input id="nume" type="text" name="nume" value={form.nume} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="prenume">Prenume</label>
          <input id="prenume" type="text" name="prenume" value={form.prenume} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="telefon">Telefon</label>
          <input id="telefon" type="tel" name="telefon" value={form.telefon} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="specializare">Specializare</label>
          <input id="specializare" type="text" name="specializare" value={form.specializare} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="parola">Parolă</label>
          <input id="parola" type="password" name="parola" value={form.parola} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 12, padding: '12px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16 }}>
          {loading ? 'Se salvează...' : 'Adaugă medic'}
        </button>
      </form>
      {mesaj && <div style={{ marginTop: 20, textAlign: 'center', fontWeight: 500 }}>{mesaj}</div>}
    </div>
  );
}

export default AdaugaMedic;