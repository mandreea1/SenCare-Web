import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PacientDetalii() {
  const { id } = useParams();
  const [pacient, setPacient] = useState(null);
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    const fetchPacient = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}`);
        setPacient(res.data);
      } catch (err) {
        setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
      }
    };
    fetchPacient();
  }, [id]);

  if (mesaj) return <div>{mesaj}</div>;
  if (!pacient) return <div>Se încarcă...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Detalii pacient</h2>
      <div><b>Nume:</b> {pacient.Nume}</div>
      <div><b>Prenume:</b> {pacient.Prenume}</div>
      <div><b>Email:</b> {pacient.Email}</div>
      <div><b>Vârstă:</b> {pacient.Varsta}</div>
      <div><b>CNP:</b> {pacient.CNP}</div>
      <div><b>Adresă:</b> {pacient.Adresa}</div>
      <div><b>Telefon:</b> {pacient.NumarTelefon}</div>
      <div><b>Profesie:</b> {pacient.Profesie}</div>
      <div><b>Loc muncă:</b> {pacient.LocMunca}</div>
      <div><b>Istoric medical:</b> {pacient.IstoricMedical}</div>
      <div><b>Alergii:</b> {pacient.Alergii}</div>
      <div><b>Consultații cardiologice:</b> {pacient.ConsultatiiCardiologice}</div>
      {/* Aici poți adăuga grafice, alarme, etc. */}
      <Link to={`/doctor/pacient/${id}/edit`}>Editează pacient</Link>
    </div>
  );
}

export default PacientDetalii;