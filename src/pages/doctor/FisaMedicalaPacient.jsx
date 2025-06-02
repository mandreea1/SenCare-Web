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
  const [ecgStringDinBackendSauUltimaMasurare, setEcgStringDinBackendSauUltimaMasurare] = useState('');
  const [valoriNormale, setValoriNormale] = useState(null);
  const [editValori, setEditValori] = useState(false);
  const [formValori, setFormValori] = useState({
  ValoarePulsMin: '',
  ValoarePulsMax: '',
  ValoareTemperaturaMin: '',
  ValoareTemperaturaMax: '',
  ValoareECGMin: '',
  ValoareECGMax: '',
  ValoareUmiditateMin: '',
  ValoareUmiditateMax: ''
});
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

useEffect(() => {
  async function fetchEcg() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/ecg-ultim`);
      console.log('ECG response:', res.data);
      // Transformă stringul în array de numere
      const ecgArray = res.data?.ECG
        ? res.data.ECG.split(',').map(val => Number(val.trim()))
        : [];
      setEcgStringDinBackendSauUltimaMasurare(ecgArray);
    } catch (err) {
      setEcgStringDinBackendSauUltimaMasurare([]);
    }
  }
  fetchEcg();
}, [id]);

useEffect(() => {
  async function fetchValoriNormale() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/valorinormale`);
      setValoriNormale(res.data);
      setFormValori(res.data || formValori);
    } catch (err) {
      setValoriNormale(null);
    }
  }
  fetchValoriNormale();
}, [id]);

  if (loading) return <div className="fisa-medicala-container">Se încarcă...</div>;
  if (mesaj) return <div className="fisa-medicala-container" style={{ color: 'red' }}>{mesaj}</div>;
  if (!pacient) return <div className="fisa-medicala-container">Nu există fișă medicală pentru acest pacient.</div>;

  const handleChangeValori = (e) => {
  setFormValori({ ...formValori, [e.target.name]: e.target.value });
};

const handleSaveValori = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/valorinormale`, formValori);
    setValoriNormale(formValori);
    setEditValori(false);
  } catch (err) {
    alert('Eroare la salvare valori normale!');
  }
};

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
            <b>III. Valori normale senzori</b>
            {!editValori && valoriNormale && (
                <div>
                <div>Puls: {valoriNormale.ValoarePulsMin} - {valoriNormale.ValoarePulsMax} bpm</div>
                <div>Temperatură: {valoriNormale.ValoareTemperaturaMin} - {valoriNormale.ValoareTemperaturaMax} °C</div>
                <div>ECG: {valoriNormale.ValoareECGMin} - {valoriNormale.ValoareECGMax}</div>
                <div>Umiditate: {valoriNormale.ValoareUmiditateMin} - {valoriNormale.ValoareUmiditateMax} %</div>
                <button className="btn-primary" onClick={() => setEditValori(true)}>Editează valori normale</button>
                </div>
            )}
            {editValori && (
                <div>
                <label>Puls min: <input type="number" name="ValoarePulsMin" value={formValori.ValoarePulsMin} onChange={handleChangeValori} /></label>
                <label>Puls max: <input type="number" name="ValoarePulsMax" value={formValori.ValoarePulsMax} onChange={handleChangeValori} /></label>
                <label>Temperatură min: <input type="number" name="ValoareTemperaturaMin" value={formValori.ValoareTemperaturaMin} onChange={handleChangeValori} /></label>
                <label>Temperatură max: <input type="number" name="ValoareTemperaturaMax" value={formValori.ValoareTemperaturaMax} onChange={handleChangeValori} /></label>
                <label>ECG min: <input type="number" name="ValoareECGMin" value={formValori.ValoareECGMin} onChange={handleChangeValori} /></label>
                <label>ECG max: <input type="number" name="ValoareECGMax" value={formValori.ValoareECGMax} onChange={handleChangeValori} /></label>
                <label>Umiditate min: <input type="number" name="ValoareUmiditateMin" value={formValori.ValoareUmiditateMin} onChange={handleChangeValori} /></label>
                <label>Umiditate max: <input type="number" name="ValoareUmiditateMax" value={formValori.ValoareUmiditateMax} onChange={handleChangeValori} /></label>
                <button className="btn-primary" onClick={handleSaveValori}>Salvează</button>
                <button className="btn-secondary" onClick={() => setEditValori(false)}>Anulează</button>
                </div>
            )}
            {!valoriNormale && !editValori && (
                <button className="btn-primary" onClick={() => setEditValori(true)}>Definește valori normale</button>
            )}
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