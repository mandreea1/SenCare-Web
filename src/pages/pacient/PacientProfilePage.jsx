import React, { useEffect, useState } from 'react';

export default function PacientProfilePage({ user }) {
  const [pacient, setPacient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');

  useEffect(() => {
    async function fetchPacient() {
      setLoading(true);
      setEroare('');
      try {
        const userId = user?.userId || localStorage.getItem('userId');
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/pacient/profil?userId=${userId}`);
        if (!res.ok) throw new Error('Eroare la încărcarea profilului pacientului');
        const data = await res.json();
        setPacient(data);
      } catch (err) {
        setEroare('Nu s-au putut încărca datele pacientului.');
      } finally {
        setLoading(false);
      }
    }
    fetchPacient();
  }, [user]);

  if (loading) return <div>Se încarcă profilul...</div>;
  if (eroare) return <div className="error-message">{eroare}</div>;
  if (!pacient) return <div>Nu există date pentru acest pacient.</div>;

  return (
    <div className="profile-page">
      <h2>Profilul pacientului</h2>
      <div className="profile-info">
        <div><strong>Nume:</strong> {pacient.Nume}</div>
        <div><strong>Prenume:</strong> {pacient.Prenume}</div>
        <div><strong>Email:</strong> {pacient.Email}</div>
        <div><strong>Vârstă:</strong> {pacient.Varsta}</div>
        <div><strong>CNP:</strong> {pacient.CNP}</div>
        <div><strong>Adresă:</strong> {pacient.Adresa}</div>
        <div><strong>Număr telefon:</strong> {pacient.NumarTelefon}</div>
        <div><strong>Profesie:</strong> {pacient.Profesie}</div>
        <div><strong>Loc muncă:</strong> {pacient.LocMunca}</div>
      </div>
    </div>
  );
}