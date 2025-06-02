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

const [showAlarmModal, setShowAlarmModal] = useState(false);
const [selectedParameter, setSelectedParameter] = useState(null);
const [alarmeAvertizari, setAlarmeAvertizari] = useState([]);
const [newAlarm, setNewAlarm] = useState({
  TipAlarma: '',
  Descriere: ''
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
      setFormValori({
        ValoarePulsMin: res.data.ValoarePulsMin ?? '',
        ValoarePulsMax: res.data.ValoarePulsMax ?? '',
        ValoareTemperaturaMin: res.data.ValoareTemperaturaMin ?? '',
        ValoareTemperaturaMax: res.data.ValoareTemperaturaMax ?? '',
        ValoareECGMin: res.data.ValoareECGMin ?? '',
        ValoareECGMax: res.data.ValoareECGMax ?? '',
        ValoareUmiditateMin: res.data.ValoareUmiditateMin ?? '',
        ValoareUmiditateMax: res.data.ValoareUmiditateMax ?? ''
      });
    } catch (err) {
      setValoriNormale(null);
    }
  }
  fetchValoriNormale();
}, [id]);

useEffect(() => {
  async function fetchAlarme() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/alarme`);
      setAlarmeAvertizari(res.data);
    } catch (err) {
      console.error('Eroare la încărcarea alarmelor:', err);
    }
  }
  fetchAlarme();
}, [id]);

// Adaugă aceste funcții de handler
const handleAddAlarm = (parameter) => {
  setSelectedParameter(parameter);
  setShowAlarmModal(true);
};

const handleSaveAlarm = async () => {
  try {
    if (!newAlarm.TipAlarma || !newAlarm.Descriere) {
      alert('Vă rugăm completați toate câmpurile!');
      return;
    }

    const alarmToSave = {
      ...newAlarm,
      PacientID: id
    };

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/alarme`, alarmToSave);
    
    // Reîncarcă alarmele
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/alarme`);
    setAlarmeAvertizari(res.data);
    
    // Resetează formularul
    setNewAlarm({ TipAlarma: '', Descriere: '' });
    setShowAlarmModal(false);
  } catch (err) {
    console.error('Eroare:', err);
    alert('Eroare la salvarea alarmei: ' + (err.response?.data?.error || err.message));
  }
};

  if (loading) return <div className="fisa-medicala-container">Se încarcă...</div>;
  if (mesaj) return <div className="fisa-medicala-container" style={{ color: 'red' }}>{mesaj}</div>;
  if (!pacient) return <div className="fisa-medicala-container">Nu există fișă medicală pentru acest pacient.</div>;

  const handleChangeValori = (e) => {
  setFormValori({ ...formValori, [e.target.name]: e.target.value });
};

const handleSaveValori = async () => {
  try {
    // Crează textul pentru istoric cu valorile vechi
    const dataActuala = new Date().toLocaleString('ro-RO');
    const istoricText = `[${dataActuala}] Modificare valori normale - Valori vechi: Puls: ${valoriNormale.ValoarePulsMin}-${valoriNormale.ValoarePulsMax} bpm, ` +
      `Temperatură: ${valoriNormale.ValoareTemperaturaMin}-${valoriNormale.ValoareTemperaturaMax}°C, ` +
      `ECG: ${valoriNormale.ValoareECGMin}-${valoriNormale.ValoareECGMax}, ` +
      `Umiditate: ${valoriNormale.ValoareUmiditateMin}-${valoriNormale.ValoareUmiditateMax}%`;

    // Salvează valorile noi
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/valorinormale`, formValori);
    
    // Salvează în istoric valorile vechi
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/istoric`, {
      istoricpacient: istoricText
    });

    // Actualizează starea
    setValoriNormale(formValori);
    setEditValori(false);
    
    // Reîncarcă istoricul
    const resIstoric = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/istoric`);
    setIstoric(resIstoric.data);

    alert('Valorile au fost salvate cu succes!');
  } catch (err) {
    console.error('Eroare:', err);
    alert('Eroare la salvare valori normale! ' + (err.response?.data?.message || err.message));
  }
};

const handleDeleteAlarm = async (alarmaId) => {
  if (window.confirm('Sigur doriți să ștergeți această alarmă?')) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/alarme/${alarmaId}`);
      
      // Reîncarcă lista de alarme
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/alarme`);
      setAlarmeAvertizari(res.data);
    } catch (err) {
      console.error('Eroare la ștergerea alarmei:', err);
      alert('Eroare la ștergerea alarmei: ' + (err.response?.data?.error || err.message));
    }
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
                    <div className="valori-form-grid">
                        <label>Puls min: <input type="number" name="ValoarePulsMin" value={formValori.ValoarePulsMin} onChange={handleChangeValori} /></label>
                        <label>Puls max: <input type="number" name="ValoarePulsMax" value={formValori.ValoarePulsMax} onChange={handleChangeValori} /></label>
                        <label>Temperatură min: <input type="number" name="ValoareTemperaturaMin" value={formValori.ValoareTemperaturaMin} onChange={handleChangeValori} /></label>
                        <label>Temperatură max: <input type="number" name="ValoareTemperaturaMax" value={formValori.ValoareTemperaturaMax} onChange={handleChangeValori} /></label>
                        <label>ECG min: <input type="number" name="ValoareECGMin" value={formValori.ValoareECGMin} onChange={handleChangeValori} /></label>
                        <label>ECG max: <input type="number" name="ValoareECGMax" value={formValori.ValoareECGMax} onChange={handleChangeValori} /></label>
                        <label>Umiditate min: <input type="number" name="ValoareUmiditateMin" value={formValori.ValoareUmiditateMin} onChange={handleChangeValori} /></label>
                        <label>Umiditate max: <input type="number" name="ValoareUmiditateMax" value={formValori.ValoareUmiditateMax} onChange={handleChangeValori} /></label>
                    </div>
                    <button className="btn-primary" onClick={handleSaveValori}>Salvează</button>
                    <button className="btn-secondary btn-blue-outline" onClick={() => setEditValori(false)}>Anulează</button>
                </div>
            )}
            {!valoriNormale && !editValori && (
                <button className="btn-primary" onClick={() => setEditValori(true)}>Definește valori normale</button>
            )}
            </div>

        <div className="fisa-section">
  <b>IV. Alarme și Avertizări</b>
  <div className="alarme-grid">
    {/* Temperatura */}
    <div className="parametru-card">
      <h3>Temperatura</h3>
      <div className="alarme-list">
        {alarmeAvertizari
          .filter(a => a.TipAlarma.includes('Temperatura'))
          .map((alarma, idx) => (
            <div key={idx} className={`alarma-item ${alarma.TipAlarma.includes('Avertizare') ? 'avertizare' : 'alarma'}`}>
  <div className="alarma-header">
    <span className="alarma-tip">{alarma.TipAlarma}</span>
    <button 
      className="btn-delete-alarm" 
      onClick={() => handleDeleteAlarm(alarma.AlarmaID)}
      title="Șterge alarma"
    >
      ×
    </button>
  </div>
  <span className="alarma-descriere">{alarma.Descriere}</span>
</div>
          ))}
      </div>
      <button className="btn-add-alarm" onClick={() => handleAddAlarm('Temperatura')}>
        + Adaugă Alarmă/Avertizare
      </button>
    </div>

    {/* Puls */}
    <div className="parametru-card">
      <h3>Puls</h3>
      <div className="alarme-list">
        {alarmeAvertizari
          .filter(a => a.TipAlarma.includes('Puls'))
          .map((alarma, idx) => (
            <div key={idx} className={`alarma-item ${alarma.TipAlarma.includes('Avertizare') ? 'avertizare' : 'alarma'}`}>
  <div className="alarma-header">
    <span className="alarma-tip">{alarma.TipAlarma}</span>
    <button 
      className="btn-delete-alarm" 
      onClick={() => handleDeleteAlarm(alarma.AlarmaID)}
      title="Șterge alarma"
    >
      ×
    </button>
  </div>
  <span className="alarma-descriere">{alarma.Descriere}</span>
</div>
          ))}
      </div>
      <button className="btn-add-alarm" onClick={() => handleAddAlarm('Puls')}>
        + Adaugă Alarmă/Avertizare
      </button>
    </div>

    {/* ECG */}
    <div className="parametru-card">
      <h3>ECG</h3>
      <div className="alarme-list">
        {alarmeAvertizari
          .filter(a => a.TipAlarma.includes('ECG'))
          .map((alarma, idx) => (
            <div key={idx} className={`alarma-item ${alarma.TipAlarma.includes('Avertizare') ? 'avertizare' : 'alarma'}`}>
  <div className="alarma-header">
    <span className="alarma-tip">{alarma.TipAlarma}</span>
    <button 
      className="btn-delete-alarm" 
      onClick={() => handleDeleteAlarm(alarma.AlarmaID)}
      title="Șterge alarma"
    >
      ×
    </button>
  </div>
  <span className="alarma-descriere">{alarma.Descriere}</span>
</div>
          ))}
      </div>
      <button className="btn-add-alarm" onClick={() => handleAddAlarm('ECG')}>
        + Adaugă Alarmă/Avertizare
      </button>
    </div>

    {/* Umiditate */}
    <div className="parametru-card">
      <h3>Umiditate</h3>
      <div className="alarme-list">
        {alarmeAvertizari
          .filter(a => a.TipAlarma.includes('Umiditate'))
          .map((alarma, idx) => (
            <div key={idx} className={`alarma-item ${alarma.TipAlarma.includes('Avertizare') ? 'avertizare' : 'alarma'}`}>
  <div className="alarma-header">
    <span className="alarma-tip">{alarma.TipAlarma}</span>
    <button 
      className="btn-delete-alarm" 
      onClick={() => handleDeleteAlarm(alarma.AlarmaID)}
      title="Șterge alarma"
    >
      ×
    </button>
  </div>
  <span className="alarma-descriere">{alarma.Descriere}</span>
</div>
          ))}
      </div>
      <button className="btn-add-alarm" onClick={() => handleAddAlarm('Umiditate')}>
        + Adaugă Alarmă/Avertizare
      </button>
    </div>
  </div>

  {/* Modal pentru adăugare alarmă/avertizare */}
  {showAlarmModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Adaugă Alarmă/Avertizare pentru {selectedParameter}</h3>
        <div className="form-group">
          <label>Tip:</label>
          <select 
            value={newAlarm.TipAlarma} 
            onChange={(e) => setNewAlarm({...newAlarm, TipAlarma: e.target.value})}
          >
            <option value="">Selectează tipul...</option>
            <option value={`Alarma ${selectedParameter}`}>Alarmă</option>
            <option value={`Avertizare ${selectedParameter}`}>Avertizare</option>
          </select>
        </div>
        <div className="form-group">
          <label>Descriere:</label>
          <textarea
            value={newAlarm.Descriere}
            onChange={(e) => setNewAlarm({...newAlarm, Descriere: e.target.value})}
            placeholder="Introduceți descrierea..."
          />
        </div>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={handleSaveAlarm}>Salvează</button>
          <button className="btn-secondary" onClick={() => setShowAlarmModal(false)}>Anulează</button>
        </div>
      </div>
    </div>
  )}
</div>
        <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate(-1)}>
          Înapoi la pacienți
        </button>
      </div>
    </div>
  );
}

export default FisaMedicalaPacient;