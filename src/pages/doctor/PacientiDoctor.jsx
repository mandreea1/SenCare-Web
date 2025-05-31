import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PacientiDoctor() {
  const doctorEmail = localStorage.getItem('email');
  const [pacienti, setPacienti] = useState([]);
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    const fetchPacienti = async () => {
      try {
        const res = await axios.get('${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacienti', {
          params: { doctorEmail }
        });
        setPacienti(res.data);
      } catch (err) {
        setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
      }
    };
    fetchPacienti();
  }, [doctorEmail]);

  const handleSterge = async (id) => {
    if (!window.confirm('Sigur vrei să ștergi acest pacient?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}`);
      setPacienti(pacienti.filter(p => p.PacientID !== id));
    } catch (err) {
      setMesaj('Eroare la ștergere: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Pacienții mei</h2>
      {mesaj && <div style={{ color: 'red' }}>{mesaj}</div>}
      <table border="1" cellPadding={6} style={{ width: '100%', marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Email</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {pacienti.map(p => (
            <tr key={p.PacientID}>
              <td>{p.Nume}</td>
              <td>{p.Prenume}</td>
              <td>{p.Email}</td>
              <td>
                <Link to={`/doctor/pacient/${p.PacientID}`}>Vizualizează</Link> |{' '}
                <Link to={`/doctor/pacient/${p.PacientID}/edit`}>Modifică</Link> |{' '}
                <button onClick={() => handleSterge(p.PacientID)}>Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PacientiDoctor;