import React, { useState } from 'react';
import axios from 'axios';

const formStyles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0 0 0', // mai sus
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 4px 24px rgba(60,60,120,0.10)',
    padding: '40px 32px 32px 32px',
    maxWidth: 1700,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '28px 36px',
    width: '100%',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 0,
  },
  label: {
    fontWeight: 500,
    marginBottom: 4,
    color: '#3840a7',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #cfd8dc',
    fontSize: 16,
    outline: 'none',
    marginBottom: 8,
    background: '#fafbff',
    transition: 'border 0.2s',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #cfd8dc',
    fontSize: 16,
    minHeight: 48,
    outline: 'none',
    marginBottom: 8,
    background: '#fafbff',
    transition: 'border 0.2s',
  },
  button: {
    background: 'linear-gradient(90deg, #6a6fd5 0%, #3840a7 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px 0',
    fontWeight: 600,
    fontSize: 18,
    cursor: 'pointer',
    marginTop: 12,
    transition: 'background 0.2s',
    width: 240,
    alignSelf: 'center'
  },
  mesaj: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 500,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
    gridColumn: '1 / -1',
    fontWeight: 800,
    fontSize: 38,
    letterSpacing: 1,
    lineHeight: 1.1,
    textShadow: '0 2px 8px rgba(60,60,120,0.07)',
  }
};

function AdaugaPacient() {
  const doctorEmail = localStorage.getItem('email');
  const [form, setForm] = useState({
    Email: '',
    password: '',
    nume: '',
    prenume: '',
    varsta: '',
    cnp: '',
    adresa: '',
    numarTelefon: '',
    profesie: '',
    locMunca: '',
    istoricMedical: '',
    alergii: '',
    consultatiiCardiologice: ''
  });
  const [mesaj, setMesaj] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/add-pacient`, {
        doctorEmail,
        ...form
      });
      setMesaj('Pacient adăugat cu succes!');
      setForm({
        Email: '',
        password: '',
        nume: '',
        prenume: '',
        varsta: '',
        cnp: '',
        adresa: '',
        numarTelefon: '',
        profesie: '',
        locMunca: '',
        istoricMedical: '',
        alergii: '',
        consultatiiCardiologice: ''
      });
    } catch (err) {
      setMesaj('Eroare la adăugare: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={formStyles.wrapper}>
      <form onSubmit={handleSubmit} style={formStyles.card} autoComplete="off">
        <h2 style={formStyles.title}>
          <span style={{ color: '#3840a7', fontWeight: 900 }}>+</span> Adaugă pacient
        </h2>
        <div style={formStyles.grid}>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Email</label>
            <input
              name="Email"
              type="email"
              placeholder="Email"
              value={form.Email}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Parolă</label>
            <input
              name="password"
              type="password"
              placeholder="Parolă"
              value={form.password}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Nume</label>
            <input
              name="nume"
              placeholder="Nume"
              value={form.nume}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Prenume</label>
            <input
              name="prenume"
              placeholder="Prenume"
              value={form.prenume}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Vârstă</label>
            <input
              name="varsta"
              type="number"
              min="0"
              placeholder="Vârstă"
              value={form.varsta}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>CNP</label>
            <input
              name="cnp"
              placeholder="CNP"
              value={form.cnp}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Adresă</label>
            <input
              name="adresa"
              placeholder="Adresă"
              value={form.adresa}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Număr telefon</label>
            <input
              name="numarTelefon"
              placeholder="Număr telefon"
              value={form.numarTelefon}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Profesie</label>
            <input
              name="profesie"
              placeholder="Profesie"
              value={form.profesie}
              onChange={handleChange}
              style={formStyles.input}
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Loc muncă</label>
            <input
              name="locMunca"
              placeholder="Loc muncă"
              value={form.locMunca}
              onChange={handleChange}
              style={formStyles.input}
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Istoric medical</label>
            <textarea
              name="istoricMedical"
              placeholder="Istoric medical"
              value={form.istoricMedical}
              onChange={handleChange}
              style={formStyles.textarea}
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Alergii</label>
            <textarea
              name="alergii"
              placeholder="Alergii"
              value={form.alergii}
              onChange={handleChange}
              style={formStyles.textarea}
            />
          </div>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Consultații cardiologice</label>
            <textarea
              name="consultatiiCardiologice"
              placeholder="Consultații cardiologice"
              value={form.consultatiiCardiologice}
              onChange={handleChange}
              style={formStyles.textarea}
            />
          </div>
        </div>
        <button type="submit" style={formStyles.button}>
          Adaugă pacient
        </button>
        {mesaj && (
          <div
            style={{
              ...formStyles.mesaj,
              color: mesaj.includes('succes') ? 'green' : 'red'
            }}
          >
            {mesaj}
          </div>
        )}
      </form>
    </div>
  );
}

export default AdaugaPacient;