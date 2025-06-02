import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PacientiDoctor() {
  const { user } = useAuth();
  const doctorEmail = user?.email;
  const [pacienti, setPacienti] = useState([]);
  const [mesaj, setMesaj] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacienti = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacienti`, {
          params: { doctorEmail }
        });
        setPacienti(res.data);
      } catch (err) {
        setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
      }
    };
    fetchPacienti();
  }, [doctorEmail]);

  const handleAction = (id, action) => {
     if (action === 'fisa') {
    navigate(`/doctor/pacient/${id}/fisa`);
  } else 
    if (action === 'vizualizeaza') {
      navigate(`/doctor/pacient/${id}`);
    } else if (action === 'modifica') {
      navigate(`/doctor/pacient/${id}/edit`);
    } else if (action === 'sterge') {
      if (window.confirm('Sigur vrei să ștergi acest pacient?')) {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}`)
          .then(() => setPacienti(pacienti.filter(p => p.PacientID !== id)))
          .catch(err => setMesaj('Eroare la ștergere: ' + (err.response?.data?.error || err.message)));
      }
    }
  };

  return (
    <div className="my-patients-list-container">
      <h2 className="my-patients-title">Pacienții mei</h2>
      {mesaj && <div style={{ color: 'red' }}>{mesaj}</div>}
      <div className="my-patients-list">
        {pacienti.map(p => (
          <div className="patient-card" key={p.PacientID}>
            <div className="patient-avatar">
              <span>{(p.Nume || '').charAt(0)}</span>
            </div>
            <div className="patient-info">
              <div className="patient-name">{p.Nume} {p.Prenume}</div>
              <div className="patient-details">
                <span>{p.Email}</span>
              </div>
            </div>
            <div className="patient-actions">
              <select
                className="action-select"
                defaultValue=""
                onChange={e => {
                  if (e.target.value) handleAction(p.PacientID, e.target.value);
                  e.target.value = '';
                }}
              >
                <option value="" disabled>Acțiuni</option>
                <option value="vizualizeaza">Vizualizare date Pacient</option>
                <option value="modifica">Modifică datele pacientului</option>
                <option value="sterge">Șterge pacientul</option>
                <option value="fisa">Fișă medicală</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PacientiDoctor;