import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPacient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    const fetchPacient = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/doctor/pacient/${id}`);
        setForm(res.data);
      } catch (err) {
        setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
      }
    };
    fetchPacient();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/doctor/pacient/${id}`, form);
      setMesaj('Modificare salvată!');
      setTimeout(() => navigate(`/doctor/pacient/${id}`), 1000);
    } catch (err) {
      setMesaj('Eroare la salvare: ' + (err.response?.data?.error || err.message));
    }
  };

  if (mesaj && mesaj.includes('Eroare')) return <div>{mesaj}</div>;
  if (!form) return <div>Se încarcă...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2>Editează pacient</h2>
      <input name="Nume" placeholder="Nume" value={form.Nume || ''} onChange={handleChange} required />
      <input name="Prenume" placeholder="Prenume" value={form.Prenume || ''} onChange={handleChange} required />
      <input name="Email" placeholder="Email" value={form.Email || ''} onChange={handleChange} required />
      <input name="Varsta" type="number" placeholder="Vârstă" value={form.Varsta || ''} onChange={handleChange} required />
      <input name="CNP" placeholder="CNP" value={form.CNP || ''} onChange={handleChange} required />
      <input name="Adresa" placeholder="Adresă" value={form.Adresa || ''} onChange={handleChange} required />
      <input name="NumarTelefon" placeholder="Număr telefon" value={form.NumarTelefon || ''} onChange={handleChange} required />
      <input name="Profesie" placeholder="Profesie" value={form.Profesie || ''} onChange={handleChange} />
      <input name="LocMunca" placeholder="Loc muncă" value={form.LocMunca || ''} onChange={handleChange} />
      <textarea name="IstoricMedical" placeholder="Istoric medical" value={form.IstoricMedical || ''} onChange={handleChange} />
      <textarea name="Alergii" placeholder="Alergii" value={form.Alergii || ''} onChange={handleChange} />
      <textarea name="ConsultatiiCardiologice" placeholder="Consultații cardiologice" value={form.ConsultatiiCardiologice || ''} onChange={handleChange} />
      <button type="submit">Salvează modificările</button>
      <div style={{ color: mesaj.includes('Eroare') ? 'red' : 'green' }}>{mesaj}</div>
    </form>
  );
}

export default EditPacient;