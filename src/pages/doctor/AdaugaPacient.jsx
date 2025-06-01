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
    <form className="add-pacient-form" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="form-title">
        <span style={{ color: '#3840a7', fontWeight: 900 }}>+</span> Adaugă pacient
      </h2>
      <div className="form-grid">
        <div className="form-field">
          <label>Email</label>
          <input
            name="Email"
            type="email"
            placeholder="Email"
            value={form.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Parolă</label>
          <input
            name="password"
            type="password"
            placeholder="Parolă"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Nume</label>
          <input
            name="nume"
            placeholder="Nume"
            value={form.nume}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Prenume</label>
          <input
            name="prenume"
            placeholder="Prenume"
            value={form.prenume}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Vârstă</label>
          <input
            name="varsta"
            type="number"
            min="0"
            placeholder="Vârstă"
            value={form.varsta}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>CNP</label>
          <input
            name="cnp"
            placeholder="CNP"
            value={form.cnp}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Adresă</label>
          <input
            name="adresa"
            placeholder="Adresă"
            value={form.adresa}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Număr telefon</label>
          <input
            name="numarTelefon"
            placeholder="Număr telefon"
            value={form.numarTelefon}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Profesie</label>
          <input
            name="profesie"
            placeholder="Profesie"
            value={form.profesie}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Loc muncă</label>
          <input
            name="locMunca"
            placeholder="Loc muncă"
            value={form.locMunca}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Istoric medical</label>
          <textarea
            name="istoricMedical"
            placeholder="Istoric medical"
            value={form.istoricMedical}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Alergii</label>
          <textarea
            name="alergii"
            placeholder="Alergii"
            value={form.alergii}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Consultații cardiologice</label>
          <textarea
            name="consultatiiCardiologice"
            placeholder="Consultații cardiologice"
            value={form.consultatiiCardiologice}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit">
        Adaugă pacient
      </button>
      {mesaj && (
        <div
          className="form-message"
          style={{ color: mesaj.includes('succes') ? 'green' : 'red' }}
        >
          {mesaj}
        </div>
      )}
    </form>
  );
}

export default AdaugaPacient;