import React, { useState } from 'react';
import axios from 'axios';

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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2>Adaugă pacient</h2>
      <input name="Email" placeholder="Email" value={form.Email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Parolă" value={form.password} onChange={handleChange} required />
      <input name="nume" placeholder="Nume" value={form.nume} onChange={handleChange} required />
      <input name="prenume" placeholder="Prenume" value={form.prenume} onChange={handleChange} required />
      <input name="varsta" type="number" placeholder="Vârstă" value={form.varsta} onChange={handleChange} required />
      <input name="cnp" placeholder="CNP" value={form.cnp} onChange={handleChange} required />
      <input name="adresa" placeholder="Adresă" value={form.adresa} onChange={handleChange} required />
      <input name="numarTelefon" placeholder="Număr telefon" value={form.numarTelefon} onChange={handleChange} required />
      <input name="profesie" placeholder="Profesie" value={form.profesie} onChange={handleChange} />
      <input name="locMunca" placeholder="Loc muncă" value={form.locMunca} onChange={handleChange} />
      <textarea name="istoricMedical" placeholder="Istoric medical" value={form.istoricMedical} onChange={handleChange} />
      <textarea name="alergii" placeholder="Alergii" value={form.alergii} onChange={handleChange} />
      <textarea name="consultatiiCardiologice" placeholder="Consultații cardiologice" value={form.consultatiiCardiologice} onChange={handleChange} />
      <button type="submit">Adaugă pacient</button>
      <div style={{ color: mesaj.includes('succes') ? 'green' : 'red' }}>{mesaj}</div>
    </form>
  );
}

export default AdaugaPacient;