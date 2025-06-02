import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PacientProfilePage() {
  const { user } = useAuth();
  const [pacient, setPacient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPacient() {
      setLoading(true);
      setError('');
      try {
        const userId = user?.userId;
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/pacient/profil?userId=${userId}`);
        if (!res.ok) throw new Error('Eroare la încărcarea profilului');
        const data = await res.json();
        setPacient(data);
      } catch (err) {
        setError('Nu s-au putut încărca datele.');
      } finally {
        setLoading(false);
      }
    }
    if (user?.userId) fetchPacient();
  }, [user]);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #dbeafe', padding: 32 }}>
      <h2 className="mb-4">Profilul pacientului</h2>
      {loading && <div>Se încarcă datele...</div>}
      {error && <div className="text-danger">{error}</div>}
      {pacient && (
        <>
          <div className="mb-3"><strong>Nume:</strong> {pacient.Nume}</div>
          <div className="mb-3"><strong>Prenume:</strong> {pacient.Prenume}</div>
          <div className="mb-3"><strong>Email:</strong> {pacient.Email}</div>
          <div className="mb-3"><strong>Vârstă:</strong> {pacient.Varsta}</div>
          <div className="mb-3"><strong>CNP:</strong> {pacient.CNP}</div>
          <div className="mb-3"><strong>Adresă:</strong> {pacient.Adresa}</div>
          <div className="mb-3"><strong>Număr telefon:</strong> {pacient.NumarTelefon}</div>
          <div className="mb-3"><strong>Profesie:</strong> {pacient.Profesie}</div>
          <div className="mb-3"><strong>Loc muncă:</strong> {pacient.LocMunca}</div>
        </>
      )}
    </div>
  );
}