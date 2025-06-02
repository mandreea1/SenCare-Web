import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditarePacient() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [initialForm, setInitialForm] = useState(null); // Add initialForm state
  const [mesaj, setMesaj] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Add handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  useEffect(() => {
    async function fetchPacient() {
      setLoading(true);
      setMesaj('');
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}`);
        setForm(res.data);
        setInitialForm(res.data); // Save initial data
      } catch (err) {
        setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchPacient();
  }, [id]);

 const handleSubmit = async e => {
  e.preventDefault();
  setMesaj('');
  try {
    const dataActuala = new Date().toLocaleString('ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Compare current values (form) with initial values (initialForm)
    const modificari = Object.entries(form)
      .filter(([key, value]) => 
        value !== initialForm[key] && 
        key !== 'id' && 
        key !== 'PacientID'
      )
      .map(([key, value]) => `${key}: ${initialForm[key] || '-'}`)
      .join(', ');

    if (modificari.length > 0) {
      const istoricText = `[${dataActuala}] Modificare date medicale - Valori vechi: ${modificari}`;

      // Save patient changes
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}`, form);
      
      // Add to history
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/istoric`, {
        istoricpacient: istoricText
      });

      setMesaj('Datele au fost actualizate cu succes!');
      setTimeout(() => navigate(-1), 1200);
    } else {
      setMesaj('Nu s-au detectat modificări.');
    }
  } catch (err) {
    console.error('Eroare:', err);
    setMesaj('Eroare la actualizare: ' + (err.response?.data?.error || err.message));
  }
};

  if (loading) return <div className="my-patients-list-container">Se încarcă...</div>;
  if (!form) return <div className="my-patients-list-container">Nu există date pentru acest pacient.</div>;

  return (
    <form className="edit-pacient-form" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="form-title">Editează pacient</h2>
      <div className="form-grid">
        <div className="form-field">
          <label>Email</label>
          <input
            name="Email"
            type="email"
            value={form.Email || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Nume</label>
          <input
            name="Nume"
            value={form.Nume || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Prenume</label>
          <input
            name="Prenume"
            value={form.Prenume || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Telefon</label>
          <input
            name="Telefon"
            value={form.Telefon || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Adresă</label>
          <input
            name="Adresa"
            value={form.Adresa || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>CNP</label>
          <input
            name="CNP"
            value={form.CNP || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Vârstă</label>
          <input
            name="Varsta"
            type="number"
            min="0"
            value={form.Varsta || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Profesie</label>
          <input
            name="Profesie"
            value={form.Profesie || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Loc muncă</label>
          <input
            name="LocMunca"
            value={form.LocMunca || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Istoric medical</label>
          <textarea
            name="IstoricMedical"
            value={form.IstoricMedical || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Alergii</label>
          <textarea
            name="Alergii"
            value={form.Alergii || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Consultații cardiologice</label>
          <textarea
            name="ConsultatiiCardiologice"
            value={form.ConsultatiiCardiologice || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit" className="btn-primary">
  Salvează modificările
</button>
      {mesaj && (
        <div className="form-message" style={{ color: mesaj.includes('succes') ? 'green' : 'red' }}>
          {mesaj}
        </div>
      )}
    </form>
  );
}

export default EditarePacient;