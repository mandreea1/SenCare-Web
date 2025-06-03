import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GraficeEvolutie1 from './GraficeEvolutie1';
import EcgChart1 from './EcgChart1';
import axios from 'axios';

function PacientFisaMedicala() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [pacient, setPacient] = useState(null);
  const [istoric, setIstoric] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesaj, setMesaj] = useState('');
  const [allEcgData, setAllEcgData] = useState([]); 
  const [valoriNormale, setValoriNormale] = useState(null);
  const [alarmeAvertizari, setAlarmeAvertizari] = useState([]);
  const [recomandari, setRecomandari] = useState([]);
  const [medicalRecordHistory, setMedicalRecordHistory] = useState([]);
  const [istoricAlarme, setIstoricAlarme] = useState([]);

  useEffect(() => {
  async function fetchIstoricAlarme() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/istoric-alarme?userId=${user?.userId}`);
      setIstoricAlarme(res.data);
    } catch (err) {
      setIstoricAlarme([]);
    }
  }
  if (user?.userId) fetchIstoricAlarme();
}, [user]);

useEffect(() => {
  async function fetchPacient() {
    setLoading(true);
    setMesaj('');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/profil?userId=${user?.userId}`);
      setPacient(res.data);
    } catch (err) {
      setMesaj('Eroare la încărcare: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }
  if (user?.userId) fetchPacient();
}, [user]);

  // ...existing code...
useEffect(() => {
  async function fetchIstoric() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/istoric?userId=${user?.userId}`);
      setIstoric(res.data);
    } catch (err) {}
  }
  if (user?.userId) fetchIstoric();
}, [user]);

useEffect(() => {
  const fetchECG = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/pacient/ecg-ultim?userId=${userId}`
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
  if (userId) fetchECG();
}, [userId]);
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
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/valorinormale?userId=${user?.userId}`);
      setValoriNormale(res.data);
    } catch (err) {
      setValoriNormale(null);
    }
  }
  if (user?.userId) fetchValoriNormale();
}, [user]);

useEffect(() => {
  async function fetchAlarme() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/alarme?userId=${user?.userId}`);
      setAlarmeAvertizari(res.data);
    } catch (err) {}
  }
  if (user?.userId) fetchAlarme();
}, [user]);

useEffect(() => {
  async function fetchRecomandari() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/recomandari?userId=${user?.userId}`);
      setRecomandari(res.data);
    } catch (err) {}
  }
  if (user?.userId) fetchRecomandari();
}, [user]);

useEffect(() => {
  async function fetchMedicalRecordHistory() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pacient/medical-records-pdf?userId=${user?.userId}`);
      setMedicalRecordHistory(res.data || []);
    } catch (err) {
      setMedicalRecordHistory([]);
    }
  }
  if (user?.userId) fetchMedicalRecordHistory();
}, [user]);

const downloadAndShowPdf = async (pdfId) => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/pacient/medical-records-pdf/${pdfId}?userId=${user?.userId}`;
  const response = await fetch(url, { credentials: 'include' });
  const blob = await response.blob();
  const fileUrl = URL.createObjectURL(blob);
  window.open(fileUrl, '_blank');
};
// ...existing code...

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
  <GraficeEvolutie1 userId={userId} />
  {allEcgValues.length > 0 ? (
    <EcgChart1 ecgString={allEcgValues} />
  ) : (
    <div style={{ color: '#888' }}>Nu există date ECG.</div>
  )}
</div>
        </div>
        <div className="fisa-section">
          <b>III. Valori normale senzori</b>
          {valoriNormale ? (
            <div>
              <div>Puls: {valoriNormale.ValoarePulsMin} - {valoriNormale.ValoarePulsMax} bpm</div>
              <div>Temperatură: {valoriNormale.ValoareTemperaturaMin} - {valoriNormale.ValoareTemperaturaMax} °C</div>
              <div>ECG: {valoriNormale.ValoareECGMin} - {valoriNormale.ValoareECGMax}</div>
              <div>Umiditate: {valoriNormale.ValoareUmiditateMin} - {valoriNormale.ValoareUmiditateMax} %</div>
            </div>
          ) : (
            <div><i>Nu există valori normale definite.</i></div>
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
                      </div>
                      <span className="alarma-descriere">{alarma.Descriere}</span>
                    </div>
                  ))}
              </div>
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
                      </div>
                      <span className="alarma-descriere">{alarma.Descriere}</span>
                    </div>
                  ))}
              </div>
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
                      </div>
                      <span className="alarma-descriere">{alarma.Descriere}</span>
                    </div>
                  ))}
              </div>
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
                      </div>
                      <span className="alarma-descriere">{alarma.Descriere}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="fisa-section">
          <b>V. Recomandări</b>
          <div className="recomandari-list">
            {recomandari.map((recomandare, idx) => (
              <div key={idx} className="recomandare-item">
                <div className="recomandare-header">
                  <span className="recomandare-tip">{recomandare.TipRecomandare}</span>
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
        </div>
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
                  <button className="btn-view-pdf" onClick={() => downloadAndShowPdf(record.id)}>
                    <i className="fas fa-eye"></i> Vizualizează
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
      </div>
      <div className="istoric-alarme-container">
  <h3 className="istoric-fise-title">Istoric alarme și avertizări</h3>
  <div className="istoric-fise-list">
    {istoricAlarme.length > 0 ? (
      istoricAlarme.map((item, idx) => (
        <div key={idx} className="fisa-istoric-item">
          <div className="fisa-istoric-info">
            <div className="fisa-istoric-data">{new Date(item.DataCreare).toLocaleString('ro-RO')}</div>
            <div className="fisa-istoric-detalii">
              <b>{item.TipAlarma}</b> — {item.Descriere}
            </div>
          </div>
          <div className="fisa-istoric-actions">
            <span className="alarma-actiune">{item.Actiune}</span>
          </div>
        </div>
      ))
    ) : (
      <p className="no-records-message">
        <i className="fas fa-info-circle"></i> Nu există alarme sau avertizări în istoric.
      </p>
    )}
  </div>
</div>
    </div>
  );
}

export default PacientFisaMedicala;