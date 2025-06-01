import React, { useEffect, useState } from 'react';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchDoctor() {
      setLoading(true);
      setError('');
      try {
        const userId = localStorage.getItem('userId');
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/doctor/profile?userId=${userId}`);
        if (!res.ok) throw new Error('Eroare la încărcarea profilului');
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        setError('Nu s-au putut încărca datele.');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, []);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/doctor/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: doctor.UserID,
          Nume: doctor.Nume,
          Prenume: doctor.Prenume,
          Specializare: doctor.Specializare,
          Telefon: doctor.Telefon,
          Email: doctor.Email,
        }),
      });
      if (!res.ok) throw new Error('Eroare la salvare');
      setSuccess('Datele au fost salvate cu succes!');
      setEdit(false);
    } catch (err) {
      setError('Nu s-au putut salva datele.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #dbeafe', padding: 32 }}>
      <h2 className="mb-4">Profilul doctorului</h2>
      {loading && <div>Se încarcă datele...</div>}
      {error && <div className="text-danger">{error}</div>}
      {success && <div className="text-success">{success}</div>}
      {doctor && (
        <>
          <div className="mb-3">
            <label className="form-label">Nume</label>
            <input
              className="form-control"
              name="Nume"
              value={doctor.Nume || ''}
              onChange={handleChange}
              disabled={!edit}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Prenume</label>
            <input
              className="form-control"
              name="Prenume"
              value={doctor.Prenume || ''}
              onChange={handleChange}
              disabled={!edit}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Specializare</label>
            <input
              className="form-control"
              name="Specializare"
              value={doctor.Specializare || ''}
              onChange={handleChange}
              disabled={!edit}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefon</label>
            <input
              className="form-control"
              name="Telefon"
              value={doctor.Telefon || ''}
              onChange={handleChange}
              disabled={!edit}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              name="Email"
              value={doctor.Email || ''}
              onChange={handleChange}
              disabled={!edit}
            />
          </div>
          {!edit ? (
            <button className="btn btn-primary" onClick={() => setEdit(true)}>
              Editează profilul
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSave} disabled={saving}>
              {saving ? 'Se salvează...' : 'Salvează'}
            </button>
          )}
          {edit && (
            <button className="btn btn-secondary ms-2" onClick={() => setEdit(false)}>
              Renunță
            </button>
          )}
        </>
      )}
    </div>
  );
}