import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VizualizarePacient() {
  const { id } = useParams();
  const [pacient, setPacient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mesaj, setMesaj] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPacient() {
      setLoading(true);
      setMesaj('');
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}`);
        setPacient(res.data);
      } catch (err) {
        setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchPacient();
  }, [id]);

  if (loading) return <div className="my-patients-list-container">Se încarcă...</div>;
  if (mesaj) return <div className="my-patients-list-container" style={{ color: 'red' }}>{mesaj}</div>;
  if (!pacient) return <div className="my-patients-list-container">Nu există date pentru acest pacient.</div>;

  return (
    <div className="my-patients-list-container">
      <div className="patient-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div className="patient-avatar" style={{ width: 56, height: 56, fontSize: '2rem' }}>
            <span>{(pacient.Nume || '').charAt(0)}</span>
          </div>
          <div>
            <div className="patient-name" style={{ fontSize: '1.4rem' }}>
              {pacient.Nume} {pacient.Prenume}
            </div>
            <div className="patient-details" style={{ fontSize: '1rem', color: '#555' }}>
              <span>{pacient.Email}</span>
              <span>{pacient.Telefon}</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 18, width: '100%' }}>
          <div className="patient-details-row"><b>CNP:</b> {pacient.CNP}</div>
          <div className="patient-details-row"><b>Adresă:</b> {pacient.Adresa}</div>
          <div className="patient-details-row"><b>Vârstă:</b> {pacient.Varsta}</div>
          <div className="patient-details-row"><b>Profesie:</b> {pacient.Profesie}</div>
          <div className="patient-details-row"><b>Loc muncă:</b> {pacient.LocMunca}</div>
          <div className="patient-details-row"><b>Istoric medical:</b> {pacient.IstoricMedical}</div>
          <div className="patient-details-row"><b>Alergii:</b> {pacient.Alergii}</div>
          <div className="patient-details-row"><b>Consultații cardiologice:</b> {pacient.ConsultatiiCardiologice}</div>
        </div>
        <button type="button" className="btn-primary" onClick={() => navigate(-1)}>
  Înapoi la pacienți
</button>
      </div>
    </div>
  );
}

export default VizualizarePacient;