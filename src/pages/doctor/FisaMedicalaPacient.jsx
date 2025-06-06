import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GraficeEvolutie from './GraficeEvolutie';
import EcgChart from './EcgChart';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

function FisaMedicalaPacient() {
  const { id } = useParams();
  const [pacient, setPacient] = useState(null);
  const [istoric, setIstoric] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesaj, setMesaj] = useState('');
 const [allEcgData, setAllEcgData] = useState([]); 
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
const [istoricAlarmeActivate, setIstoricAlarmeActivate] = useState([]);


const [showAlarmModal, setShowAlarmModal] = useState(false);
const [selectedParameter, setSelectedParameter] = useState(null);
const [alarmeAvertizari, setAlarmeAvertizari] = useState([]);
const [newAlarm, setNewAlarm] = useState({
  TipAlarma: '',
  Descriere: ''
});

const [recomandari, setRecomandari] = useState([]);
const [showRecomandareModal, setShowRecomandareModal] = useState(false);
const [newRecomandare, setNewRecomandare] = useState({
  TipRecomandare: '',
  DurataZilnica: '',
  AlteIndicatii: ''
});
  const [pdfSaved, setPdfSaved] = useState(false);
  const [medicalRecordHistory, setMedicalRecordHistory] = useState([]);
  const downloadAndShowPdf = async (pdfUrl) => {
  const response = await fetch(pdfUrl, { credentials: 'include' });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
  
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
    const fetchECG = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/ecg-ultim`
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAllEcgData(response.data);
        } else {
          setAllEcgData([]);
        }
      } catch (error) {
        setAllEcgData([]);
        console.error("Eroare la obținerea datelor ECG:", error);
      }
    };
    if (id) fetchECG();
  }, [id]);
  const allEcgValues = allEcgData
    .filter(item => item.ECG && item.ECG.trim() !== '')
    .flatMap(item => {
      try {
        const arr = JSON.parse(item.ECG);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    });


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
useEffect(() => {
    async function fetchRecomandari() {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/recomandari`);
            setRecomandari(res.data);
        } catch (err) {
            console.error('Eroare la încărcarea recomandărilor:', err);
        }
    }
    fetchRecomandari();
}, [id]);
useEffect(() => {
  async function fetchMedicalRecordHistory() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/medical-records-pdf`);
      setMedicalRecordHistory(res.data || []);
    } catch (err) {
      console.error('Eroare la încărcarea istoricului fișelor PDF:', err);
      // Setăm un array gol când nu există fișe sau endpoint-ul nu este disponibil
      setMedicalRecordHistory([]);
    }
  }
  fetchMedicalRecordHistory();
}, [id]);
useEffect(() => {
  console.log('id pentru fetch istoric alarme activate:', id); // Adaugă acest log
  async function fetchIstoricAlarmeActivate() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/istoric-alarme-activate`
      );
      setIstoricAlarmeActivate(res.data);
    } catch (err) {
      console.error('Eroare la încărcarea istoricului alarmelor activate:', err);
    }
  }
  fetchIstoricAlarmeActivate();
}, [id]);

const handleAddRecomandare = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/recomandari`, 
      newRecomandare
    );
    
    // Reîncarcă recomandările
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/recomandari`);
    setRecomandari(res.data);
    
    // Resetează formularul
    setNewRecomandare({ TipRecomandare: '', DurataZilnica: '', AlteIndicatii: '' });
    setShowRecomandareModal(false);
  } catch (err) {
    console.error('Eroare:', err);
    alert('Eroare la salvarea recomandării: ' + (err.response?.data?.error || err.message));
  }
};

const handleDeleteRecomandare = async (recomandareId) => {
  if (window.confirm('Sigur doriți să ștergeți această recomandare?')) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/recomandari/${recomandareId}`);
      
      // Reîncarcă recomandările
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/recomandari`);
      setRecomandari(res.data);
    } catch (err) {
      console.error('Eroare:', err);
      alert('Eroare la ștergerea recomandării: ' + (err.response?.data?.error || err.message));
    }
  }
};

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

const handleSavePdfWithHistory = async () => {
  try {
    const element = document.querySelector('.fisa-medicala-card');
    const opt = {
      margin: 0.5,
      filename: 'fisa-medicala.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generează PDF și obține blob
    const worker = html2pdf().from(element).set(opt);
    const pdfBlob = await worker.outputPdf('blob');

    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'fisa-medicala.pdf');
    formData.append('descriere', `Consultație din ${new Date().toLocaleDateString('ro-RO')}`);
    formData.append('date', new Date().toISOString());

    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/medical-records-pdf-upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Actualizează istoricul
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/medical-records-pdf`);
    setMedicalRecordHistory(res.data);

    setPdfSaved(true);
    setTimeout(() => setPdfSaved(false), 3000);
  } catch (err) {
    console.error('Eroare la generarea și salvarea PDF-ului:', err);
    alert('Eroare la salvarea fișei medicale ca PDF: ' + (err.message || 'A apărut o eroare necunoscută'));
  }
};


const handleDeletePdf = async (recordId) => {
  if (window.confirm('Sigur doriți să ștergeți această fișă medicală?')) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/medical-records-pdf/${recordId}`);
      
      // Abordare optimistă - eliminăm din UI înregistrarea ștearsă imediat
      setMedicalRecordHistory(prev => prev.filter(record => record.id !== recordId));
      
      // Încercăm să reîmprospătăm lista din backend
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/medical-records-pdf`);
        if (res.data) {
          setMedicalRecordHistory(res.data);
        }
      } catch (fetchErr) {
        console.warn('Nu s-a putut actualiza lista de fișe PDF de la server:', fetchErr);
        // Am folosit deja abordarea optimistă, deci UI-ul este deja actualizat
      }
    } catch (err) {
      console.error('Eroare la ștergerea PDF-ului:', err);
      
      if (err.response?.status === 404) {
        alert('Fișa medicală nu a fost găsită pe server. Lista va fi actualizată.');
        // Eliminăm din UI înregistrarea care nu mai există pe server
        setMedicalRecordHistory(prev => prev.filter(record => record.id !== recordId));
      } else {
        alert('Eroare la ștergerea fișei medicale: ' + (err.message || 'A apărut o eroare necunoscută'));
      }
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
  <GraficeEvolutie id={id} />
  {allEcgValues.length > 0 ? (
    <EcgChart ecgString={allEcgValues} />
  ) : (
    <div style={{ color: '#888' }}>Nu există date ECG.</div>
  )}
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
<div className="fisa-section">
  <b>V. Recomandări</b>
  <div className="recomandari-list">
    {recomandari.map((recomandare, idx) => (
      <div key={idx} className="recomandare-item">
        <div className="recomandare-header">
          <span className="recomandare-tip">{recomandare.TipRecomandare}</span>
          <button 
            className="btn-delete-recomandare"
            onClick={() => handleDeleteRecomandare(recomandare.RecomandareID)}
            title="Șterge recomandarea"
          >
            ×
          </button>
        </div>
        <div className="recomandare-detalii">
          <div><strong>Durata zilnică:</strong> {recomandare.DurataZilnica}</div>
          <div><strong>Alte indicații:</strong> {recomandare.AlteIndicatii}</div>
          <div className="recomandare-data">
            {new Date(recomandare.DataRecomandare).toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest'
})}
          </div>
        </div>
      </div>
    ))}
  </div>
  <button className="btn-add-recomandare" onClick={() => setShowRecomandareModal(true)}>
    + Adaugă Recomandare
  </button>

  {showRecomandareModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Adaugă Recomandare</h3>
        <div className="form-group">
          <label>Tip Recomandare:</label>
          <input
            type="text"
            value={newRecomandare.TipRecomandare}
            onChange={(e) => setNewRecomandare({
              ...newRecomandare,
              TipRecomandare: e.target.value
            })}
          />
        </div>
        <div className="form-group">
          <label>Durata Zilnică:</label>
          <input
            type="text"
            value={newRecomandare.DurataZilnica}
            onChange={(e) => setNewRecomandare({
              ...newRecomandare,
              DurataZilnica: e.target.value
            })}
          />
        </div>
        <div className="form-group">
          <label>Alte Indicații:</label>
          <textarea
            value={newRecomandare.AlteIndicatii}
            onChange={(e) => setNewRecomandare({
              ...newRecomandare,
              AlteIndicatii: e.target.value
            })}
          />
        </div>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={handleAddRecomandare}>Salvează</button>
          <button className="btn-secondary" onClick={() => setShowRecomandareModal(false)}>Anulează</button>
        </div>
      </div>
    </div>
  )}
</div>
<button 
  className="btn-save-pdf"
  onClick={handleSavePdfWithHistory}
>
  <i className="fas fa-file-pdf"></i>
  Salvează Fișă ca PDF
</button>
    
    {/* Success message that appears after saving */}
    {pdfSaved && (
      <div className="pdf-saved-message">
        <i className="fas fa-check-circle"></i>
        Fișa medicală a fost salvată cu succes!
      </div>
    )}
  </div>
  
{/* History of medical records */}
<div className="istoric-fise-container">
  <div className="istoric-fise-header">
    <h3 className="istoric-fise-title">Istoric Fișe Medicale</h3>
  </div>
  
  <div className="istoric-fise-list">
  {Array.isArray(medicalRecordHistory) && medicalRecordHistory.length > 0 ? (
    medicalRecordHistory.map((record) => (
      <div key={record.id} className="fisa-istoric-item">
        <div className="fisa-istoric-info">
          <div className="fisa-istoric-data">{record.date}</div>
          <div className="fisa-istoric-detalii">
            Fișa medicală - {record.descriere}
          </div>
        </div>
        <div className="fisa-istoric-actions">
          <button className="btn-view-pdf" onClick={() => downloadAndShowPdf(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/pacient/${id}/medical-records-pdf/${record.id}`)}>
            <i className="fas fa-eye"></i> Vizualizează
          </button>
          <button className="btn-delete-pdf" onClick={() => handleDeletePdf(record.id)}>
            <i className="fas fa-trash"></i> Șterge
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="no-records-message">
      <i className="fas fa-info-circle"></i> Nu există fișe medicale salvate în istoric.
    </p>
  )}
</div>

<div className="fisa-section">
  <h3 className="istoric-fise-title">Istoric alarme/avertizări activate</h3>
  {istoricAlarmeActivate.length === 0 && (
    <div className="fisa-field"><i>Nu există alarme/avertizări activate.</i></div>
  )}
  {istoricAlarmeActivate.map((item, idx) => (
    <div className="fisa-field" key={idx}>
      <b>{item.TipAlarma}</b> — {item.Descriere}
      <div style={{ fontSize: 12, color: '#888' }}>
        {new Date(item.DataCreare).toLocaleString('ro-RO')}
      </div>
    </div>
  ))}
</div>
  
  <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate(-1)}>
    Înapoi la pacienți
  </button>
</div>
    </div>
  );
}

export default FisaMedicalaPacient;