import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GraficeEvolutie from './GraficeEvolutie';
import EcgChart from './EcgChart';
import axios from 'axios';

function FisaMedicalaPacient() {
  const { id } = useParams();
  const [pacient, setPacient] = useState(null);
  const [istoric, setIstoric] = useState([]);
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

  useEffect(() => {
    async function fetchIstoric() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/istoric`);
        setIstoric(res.data);
      } catch (err) {
        // poți ignora eroarea sau afișa un mesaj
      }
    }
    fetchIstoric();
  }, [id]);

  if (loading) return <div className="fisa-medicala-container">Se încarcă...</div>;
  if (mesaj) return <div className="fisa-medicala-container" style={{ color: 'red' }}>{mesaj}</div>;
  if (!pacient) return <div className="fisa-medicala-container">Nu există fișă medicală pentru acest pacient.</div>;

  return (
    <div className="fisa-medicala-container">
      <div className="fisa-medicala-card">
        <div className="fisa-header">
          <h2>FIȘĂ MEDICALĂ</h2>
        </div>
        <div className="fisa-section">
          <div><b>Nume:</b> {pacient.Nume}</div>
          <div><b>Prenume:</b> {pacient.Prenume}</div>
          <div><b>CNP:</b> {pacient.CNP}</div>
          <div><b>Adresă:</b> {pacient.Adresa}</div>
          <div><b>Vârstă:</b> {pacient.Varsta}</div>
          <div><b>Profesie:</b> {pacient.Profesie}</div>
          <div><b>Loc de muncă:</b> {pacient.LocMunca}</div>
          <div><b>Istoric medical:</b> {pacient.IstoricMedical}</div>
          <div><b>Alergii:</b> {pacient.Alergii}</div>
          <div><b>Consultații cardiologice:</b> {pacient.ConsultatiiCardiologice}</div>
        </div>
        <div className="fisa-section">
          <b>I. Istoric</b>
          {istoric.length === 0 && <div className="fisa-field"><i>Nu există istoric.</i></div>}
          {istoric.map((item, idx) => (
            <div className="fisa-field" key={idx}>
              {item.istoricpacient}
            </div>
          ))}
        </div>
        <div className="fisa-section">
          <b>II. Grafice evoluție</b>
          <div style={{ marginTop: 16 }}>
            <GraficeEvolutie id={pacient.PacientID || pacient.id || id} />
            <EcgChart ecgString={ecgStringDinBackendSauUltimaMasurare} />
          </div>
        </div>
        <div className="fisa-section">
          <b>III. Diagnostic medical cu specificație cod (ICD 10)</b>
          <div className="fisa-field">{pacient.Diagnostic || <i>-</i>}</div>
        </div>
        <div className="fisa-section">
          <b>IV. Tratamente/monitorizări și recomandări</b>
          <table className="fisa-tabel">
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Tipul tratamentului</th>
                <th>Tratament curent<br />(scurtă descriere)</th>
                <th>Tratament recomandat<br />(de către medic)</th>
              </tr>
            </thead>
            <tbody>
              {(pacient.Tratamente || []).map((tr, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{tr.tip || '-'}</td>
                  <td>{tr.curent || '-'}</td>
                  <td>{tr.recomandat || '-'}</td>
                </tr>
              ))}
              {(!pacient.Tratamente || pacient.Tratamente.length === 0) && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>Nu există tratamente introduse.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate(-1)}>
          Înapoi la pacienți
        </button>
      </div>
    </div>
  );
}

export default FisaMedicalaPacient;