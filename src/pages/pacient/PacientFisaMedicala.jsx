import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PacientFisaMedicala() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      setError('');
      try {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/doctor/pacient/${user?.userId}/medical-records-pdf`);
        if (!res.ok) throw new Error('Eroare la încărcarea fișelor medicale');
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        setError('Nu s-au putut încărca fișele medicale.');
      } finally {
        setLoading(false);
      }
    }
    if (user?.userId) fetchRecords();
  }, [user]);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #dbeafe', padding: 32 }}>
      <h2 className="mb-4">Fișe medicale PDF</h2>
      {loading && <div>Se încarcă...</div>}
      {error && <div className="text-danger">{error}</div>}
      {records.length === 0 && !loading && <div>Nu există fișe medicale.</div>}
      <ul>
        {records.map(record => (
          <li key={record.id} style={{ marginBottom: 12 }}>
            <strong>{record.Descriere || 'Fișă medicală'}</strong> ({record.date || record.created_at})
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${user?.userId}/medical-records-pdf/${record.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 16 }}
            >
              Descarcă PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}