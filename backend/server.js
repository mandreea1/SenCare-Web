console.log('Pornire server.js...');
const express = require('express');
const { connectToDb, sql} = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const bcrypt = require('bcryptjs');

const cors = require('cors');

const corsOptions = {
  origin: ['https://blue-dune-02cbb2810.6.azurestaticapps.net', // Pune aici URL-ul exact al SWA
  'http://localhost:3000'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// // Servește build-ul React ca fișiere statice
// app.use(express.static(path.join(__dirname, '../build')));

// Endpoint de test pentru conexiunea la baza de date
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await sql.query`SELECT TOP 1 * FROM sys.tables`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Cerere primită pentru login:', { email, password });
  console.log('Email primit pentru login:', email);
  try {
    const result = await sql.query`
      SELECT UserID, Password, UserType FROM Utilizatori 
      WHERE Email = ${email}
    `;
    console.log('Rezultatul interogării:', result.recordset);

    if (result.recordset.length === 0) {
      console.log('Niciun utilizator găsit pentru:', { email });
      return res.status(401).json({ error: 'Email sau parolă incorectă!' });
    }

    const user = result.recordset[0];
    console.log('User găsit:', user);

    if (!user.Password) {
      console.log('Parola din DB este null sau goală!');
      return res.status(500).json({ error: 'Parola lipsă în baza de date!' });
    }

    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.Password);
    } catch (bcryptErr) {
      console.error('Eroare la bcrypt.compare:', bcryptErr);
      return res.status(500).json({ error: 'Eroare la verificarea parolei!' });
    }

    if (!passwordMatch) {
      console.log('Parola nu se potrivește!');
      return res.status(401).json({ error: 'Email sau parolă incorectă!' });
    }

    console.log('Autentificare reușită pentru:', user.Email);
    res.json({
      message: 'Autentificare reușită!',
      userType: user.UserType,
      userId: user.UserID
    });
  } catch (err) {
    console.error('Eroare la autentificare:', err);
    res.status(500).json({ error: 'Eroare la autentificare!' });
  }
});

// // Pentru orice altă rută care nu e API, trimite index.html din build
// app.get('*', (req, res) => {
//   if (!req.path.startsWith('/api')) {
//     res.sendFile(path.join(__dirname, '../build', 'index.html'));
//   }
// });


app.post('/api/admin/add-doctor', async (req, res) => {
  const { adminEmail, Email, password, specializare, nume, prenume, telefon } = req.body;

  // Verifică dacă adminEmail este un admin valid
  const adminResult = await sql.query`
    SELECT * FROM Utilizatori WHERE Email = ${adminEmail} AND UserType = 'Admin'
  `;
  if (adminResult.recordset.length === 0) {
    return res.status(403).json({ error: 'Doar adminul poate adăuga medici.' });
  }

  // Criptează parola medicului
  const hashedPassword = await bcrypt.hash(password, 10);

  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // 1. Inserează în Utilizatori
    const userResult = await transaction.request()
      .input('Email', sql.NVarChar(255), Email)
      .input('Password', sql.NVarChar(255), hashedPassword)
      .input('UserType', sql.NVarChar(50), 'doctor')
      .query(`INSERT INTO Utilizatori (Email, Password, UserType) OUTPUT INSERTED.UserID VALUES (@Email, @Password, @UserType)`);
    const userId = userResult.recordset[0].UserID;

    // 2. Inserează în Medici
    await transaction.request()
      .input('Nume', sql.NVarChar(255), nume)
      .input('Prenume', sql.NVarChar(255), prenume)
      .input('Specializare', sql.NVarChar(255), specializare)
      .input('Telefon', sql.NVarChar(50), telefon)
      .input('UserID', sql.Int, userId)
      .query(`INSERT INTO Medici (Nume, Prenume, Specializare, Telefon, UserID) VALUES (@Nume, @Prenume, @Specializare, @Telefon, @UserID)`);

    await transaction.commit();
    res.status(201).json({ message: 'Cont de medic creat cu succes!' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/doctor/add-pacient', async (req, res) => {
  const {
    doctorEmail,
    Email,
    password,
    nume,
    prenume,
    varsta,
    cnp,
    adresa,
    numarTelefon,
    profesie,
    locMunca,
    istoricMedical,
    alergii,
    consultatiiCardiologice
  } = req.body;

  const userType = 'Pacient';
  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // 1. Găsește ID-ul doctorului
    const medicResult = await transaction.request()
      .input('Email', sql.NVarChar(255), doctorEmail)
      .query(`SELECT Medici.MedicID FROM Medici
              INNER JOIN Utilizatori ON Medici.UserID = Utilizatori.UserID
              WHERE Utilizatori.Email = @Email`);
    if (medicResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Doctorul nu a fost găsit.' });
    }
    const medicId = medicResult.recordset[0].MedicID;

    // 2. Criptează parola pacientului
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Inserează în Utilizatori
    const userResult = await transaction.request()
      .input('Email', sql.NVarChar(255), Email)
      .input('Password', sql.NVarChar(255), hashedPassword)
      .input('UserType', sql.NVarChar(50), userType)
      .query(`INSERT INTO Utilizatori (Email, Password, UserType) OUTPUT INSERTED.UserID VALUES (@Email, @Password, @UserType)`);
    const userId = userResult.recordset[0].UserID;

    // 4. Inserează în Pacienti (fără MedicID!)
    const pacientResult = await transaction.request()
      .input('UserID', sql.Int, userId)
      .input('Nume', sql.NVarChar(255), nume)
      .input('Prenume', sql.NVarChar(255), prenume)
      .input('Varsta', sql.Int, varsta)
      .input('CNP', sql.Char(13), cnp)
      .input('Adresa', sql.NVarChar(500), adresa)
      .input('NumarTelefon', sql.NVarChar(20), numarTelefon)
      .input('Profesie', sql.NVarChar(255), profesie)
      .input('LocMunca', sql.NVarChar(255), locMunca)
      .query(`INSERT INTO Pacienti (UserID, Nume, Prenume, Varsta, CNP, Adresa, NumarTelefon, Profesie, LocMunca)
              OUTPUT INSERTED.PacientID
              VALUES (@UserID, @Nume, @Prenume, @Varsta, @CNP, @Adresa, @NumarTelefon, @Profesie, @LocMunca)`);
    const pacientId = pacientResult.recordset[0].PacientID;

    // 5. Inserează legătura în MediciPacienti
    await transaction.request()
      .input('MedicID', sql.Int, medicId)
      .input('PacientID', sql.Int, pacientId)
      .query(`INSERT INTO MediciPacienti (MedicID, PacientID) VALUES (@MedicID, @PacientID)`);

    // 6. Inserează în DateMedicale (dacă folosești în continuare această tabelă)
    await transaction.request()
      .input('MedicID', sql.Int, medicId)
      .input('PacientID', sql.Int, pacientId)
      .input('IstoricMedical', sql.NVarChar(sql.MAX), istoricMedical)
      .input('Alergii', sql.NVarChar(sql.MAX), alergii)
      .input('ConsultatiiCardiologice', sql.NVarChar(sql.MAX), consultatiiCardiologice)
      .query(`INSERT INTO DateMedicale (MedicID, PacientID, IstoricMedical, Alergii, ConsultatiiCardiologice)
              VALUES (@MedicID, @PacientID, @IstoricMedical, @Alergii, @ConsultatiiCardiologice)`);

    await transaction.commit();
    res.status(201).json({ message: 'Pacient și date medicale adăugate cu succes!' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/pacienti', async (req, res) => {
  const { doctorEmail } = req.query;
  try {
    // Găsește MedicID după email
    const medic = await new sql.Request()
      .input('Email', sql.NVarChar(255), doctorEmail)
      .query(`SELECT m.MedicID FROM Medici m
              INNER JOIN Utilizatori u ON m.UserID = u.UserID
              WHERE u.Email = @Email`);
    if (!medic.recordset.length) return res.status(404).json({ error: 'Doctorul nu a fost găsit.' });
    const medicId = medic.recordset[0].MedicID;

    // Selectează pacienții asociați cu acest medic din MediciPacienti
    const pacienti = await new sql.Request()
      .input('MedicID', sql.Int, medicId)
      .query(`SELECT p.PacientID, p.Nume, p.Prenume, u.Email
              FROM MediciPacienti mp
              INNER JOIN Pacienti p ON mp.PacientID = p.PacientID
              INNER JOIN Utilizatori u ON p.UserID = u.UserID
              WHERE mp.MedicID = @MedicID`);
    res.json(pacienti.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/pacient/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pacient = await new sql.Request()
      .input('PacientID', sql.Int, id)
      .query(`
        SELECT p.*, u.Email, dm.IstoricMedical, dm.Alergii, dm.ConsultatiiCardiologice
        FROM Pacienti p
        INNER JOIN Utilizatori u ON p.UserID = u.UserID
        LEFT JOIN DateMedicale dm ON p.PacientID = dm.PacientID
        WHERE p.PacientID = @PacientID
      `);
    if (!pacient.recordset.length) {
      return res.status(404).json({ error: 'Pacientul nu a fost găsit.' });
    }
    res.json(pacient.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Modificare pacient
app.put('/api/doctor/pacient/:id', async (req, res) => {
  const { id } = req.params;
  const {
    Nume, Prenume, Email, Varsta, CNP, Adresa, NumarTelefon,
    Profesie, LocMunca, IstoricMedical, Alergii, ConsultatiiCardiologice
  } = req.body;
  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // 1. Ia valorile vechi înainte de update
    const vechi = await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`
        SELECT IstoricMedical, Alergii, ConsultatiiCardiologice
        FROM DateMedicale
        WHERE PacientID = @PacientID
      `);
    const vechiDate = vechi.recordset[0];

    // 2. Update Pacienti
    await transaction.request()
      .input('PacientID', sql.Int, id)
      .input('Nume', sql.NVarChar(255), Nume)
      .input('Prenume', sql.NVarChar(255), Prenume)
      .input('Varsta', sql.Int, Varsta)
      .input('CNP', sql.Char(13), CNP)
      .input('Adresa', sql.NVarChar(500), Adresa)
      .input('NumarTelefon', sql.NVarChar(20), NumarTelefon)
      .input('Profesie', sql.NVarChar(255), Profesie)
      .input('LocMunca', sql.NVarChar(255), LocMunca)
      .query(`UPDATE Pacienti SET Nume=@Nume, Prenume=@Prenume, Varsta=@Varsta, CNP=@CNP, Adresa=@Adresa, NumarTelefon=@NumarTelefon, Profesie=@Profesie, LocMunca=@LocMunca WHERE PacientID=@PacientID`);

    // 3. Update Email în Utilizatori
    const userIdResult = await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`SELECT UserID FROM Pacienti WHERE PacientID=@PacientID`);
    const userId = userIdResult.recordset[0].UserID;
    await transaction.request()
      .input('UserID', sql.Int, userId)
      .input('Email', sql.NVarChar(255), Email)
      .query(`UPDATE Utilizatori SET Email=@Email WHERE UserID=@UserID`);

    // 4. Update DateMedicale
    await transaction.request()
      .input('PacientID', sql.Int, id)
      .input('IstoricMedical', sql.NVarChar(sql.MAX), IstoricMedical)
      .input('Alergii', sql.NVarChar(sql.MAX), Alergii)
      .input('ConsultatiiCardiologice', sql.NVarChar(sql.MAX), ConsultatiiCardiologice)
      .query(`UPDATE DateMedicale SET IstoricMedical=@IstoricMedical, Alergii=@Alergii, ConsultatiiCardiologice=@ConsultatiiCardiologice WHERE PacientID=@PacientID`);

    // 5. INSERARE ÎN ISTORIC cu valorile vechi dacă s-au modificat
    if (vechiDate && (
    (IstoricMedical !== undefined && IstoricMedical !== vechiDate.IstoricMedical) ||
    (Alergii !== undefined && Alergii !== vechiDate.Alergii) ||
    (ConsultatiiCardiologice !== undefined && ConsultatiiCardiologice !== vechiDate.ConsultatiiCardiologice)
)) {
  const istoricText = 
    `Istoric Medical: ${vechiDate.IstoricMedical || '-'} | ` +
    `Alergii: ${vechiDate.Alergii || '-'} | ` +
    `Consultații Cardiologice: ${vechiDate.ConsultatiiCardiologice || '-'}`;
  await transaction.request()
    .input('istoricpacient', sql.NVarChar(sql.MAX), istoricText)
    .input('pacientid', sql.Int, id)
    .query(`INSERT INTO istoric (istoricpacient, pacientid) VALUES (@istoricpacient, @pacientid)`);
}

    await transaction.commit();
    res.json({ message: 'Pacient modificat cu succes!' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/doctor/pacient/:id', async (req, res) => {
  const { id } = req.params;
  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // Șterge din MediciPacienti
    await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`DELETE FROM MediciPacienti WHERE PacientID=@PacientID`);

    // Șterge din DateMedicale
    await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`DELETE FROM DateMedicale WHERE PacientID=@PacientID`);

    // Găsește UserID
    const userIdResult = await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`SELECT UserID FROM Pacienti WHERE PacientID=@PacientID`);
    const userId = userIdResult.recordset[0]?.UserID;

    // Șterge din Pacienti
    await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`DELETE FROM Pacienti WHERE PacientID=@PacientID`);

    // Șterge din Utilizatori
    if (userId) {
      await transaction.request()
        .input('UserID', sql.Int, userId)
        .query(`DELETE FROM Utilizatori WHERE UserID=@UserID`);
    }

    await transaction.commit();
    res.json({ message: 'Pacient șters cu succes!' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/profile', async (req, res) => {
  const { userId, email } = req.query;
  if (!userId && !email) {
    return res.status(400).json({ error: 'Trebuie să trimiți userId sau email.' });
  }

  try {
    let result;
    if (userId) {
  result = await sql.query`
    SELECT 
      u.UserID, u.Email, u.UserType, 
      m.MedicID, m.Nume, m.Prenume, m.Specializare, m.Telefon
    FROM Utilizatori u
    INNER JOIN Medici m ON u.UserID = m.UserID
    WHERE u.UserID = ${userId} AND u.UserType = 'doctor'
  `;
} else {
  result = await sql.query`
    SELECT 
      u.UserID, u.Email, u.UserType, 
      m.MedicID, m.Nume, m.Prenume, m.Specializare, m.Telefon
    FROM Utilizatori u
    INNER JOIN Medici m ON u.UserID = m.UserID
    WHERE u.Email = ${email} AND u.UserType = 'doctor'
  `;
}

    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Doctorul nu a fost găsit.' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/doctor/profile', async (req, res) => {
  const { userId, Nume, Prenume, Specializare, Telefon, Email } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Lipsește userId.' });
  }

  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // Actualizează tabelul Medici
    await transaction.request()
      .input('Nume', sql.NVarChar, Nume)
      .input('Prenume', sql.NVarChar, Prenume)
      .input('Specializare', sql.NVarChar, Specializare)
      .input('Telefon', sql.NVarChar, Telefon)
      .input('UserID', sql.Int, userId)
      .query(`
        UPDATE Medici
        SET Nume = @Nume, Prenume = @Prenume, Specializare = @Specializare, Telefon = @Telefon
        WHERE UserID = @UserID
      `);

    // Actualizează emailul în tabelul Utilizatori
    await transaction.request()
      .input('Email', sql.NVarChar, Email)
      .input('UserID', sql.Int, userId)
      .query(`
        UPDATE Utilizatori
        SET Email = @Email
        WHERE UserID = @UserID
      `);

    await transaction.commit();
    res.json({ message: 'Profil actualizat cu succes!' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/doctor/pacient/:id/istoric', async (req, res) => {
  const { id } = req.params;
  const { istoricpacient } = req.body;
  
  try {
    await new sql.Request()
      .input('PacientID', sql.Int, id)
      .input('IstoricPacient', sql.NVarChar(sql.MAX), istoricpacient)
      .query(`INSERT INTO istoric (istoricpacient, pacientid) VALUES (@IstoricPacient, @PacientID)`);
    
    res.status(201).json({ message: 'Istoric adăugat cu succes' });
  } catch (err) {
    console.error('Eroare la adăugare istoric:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/pacient/:id/istoric', async (req, res) => {
  const { id } = req.params;
  try {
    const istoric = await new sql.Request()
      .input('PacientID', sql.Int, id)
      .query(`SELECT istoricpacient FROM istoric WHERE pacientid = @PacientID`);
    res.json(istoric.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/pacient/:id/datefiziologice', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await new sql.Request()
      .input('PacientID', sql.Int, id)
      .query(`SELECT IdMasurare, Puls, Temperatura, Umiditate, Data_timp FROM DateFiziologice WHERE PacientID = @PacientID ORDER BY Data_timp ASC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/pacient/:id/ecg-ultim', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await new sql.Request()
      .input('PacientID', sql.Int, id)
      .query(`
        SELECT TOP 1 ECG, Data_timp
        FROM DateFiziologice
        WHERE PacientID = @PacientID AND ECG IS NOT NULL AND ECG <> ''
        ORDER BY Data_timp DESC
      `);
    res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctor/pacient/:id/valorinormale', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await new sql.Request()
      .input('PacientId', sql.Int, id)
      .query('SELECT * FROM valorinormalepacient WHERE PacientId = @PacientId');
    if (!result.recordset.length) return res.json({});
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Eroare SQL valorinormale:', err);
    res.status(500).json({ error: 'Eroare la interogare valori normale.' });
  }
});

app.post('/api/doctor/pacient/:id/valorinormale', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ValoarePulsMin, ValoarePulsMax,
      ValoareTemperaturaMin, ValoareTemperaturaMax,
      ValoareECGMin, ValoareECGMax,
      ValoareUmiditateMin, ValoareUmiditateMax
    } = req.body;

    // Upsert pentru SQL Server
    await sql.query`
      MERGE valorinormalepacient AS target
      USING (SELECT ${id} AS PacientId) AS source
      ON (target.PacientId = source.PacientId)
      WHEN MATCHED THEN
        UPDATE SET 
          ValoarePulsMin = ${ValoarePulsMin},
          ValoarePulsMax = ${ValoarePulsMax},
          ValoareTemperaturaMin = ${ValoareTemperaturaMin},
          ValoareTemperaturaMax = ${ValoareTemperaturaMax},
          ValoareECGMin = ${ValoareECGMin},
          ValoareECGMax = ${ValoareECGMax},
          ValoareUmiditateMin = ${ValoareUmiditateMin},
          ValoareUmiditateMax = ${ValoareUmiditateMax}
      WHEN NOT MATCHED THEN
        INSERT (PacientId, ValoarePulsMin, ValoarePulsMax, ValoareTemperaturaMin, ValoareTemperaturaMax, ValoareECGMin, ValoareECGMax, ValoareUmiditateMin, ValoareUmiditateMax)
        VALUES (${id}, ${ValoarePulsMin}, ${ValoarePulsMax}, ${ValoareTemperaturaMin}, ${ValoareTemperaturaMax}, ${ValoareECGMin}, ${ValoareECGMax}, ${ValoareUmiditateMin}, ${ValoareUmiditateMax});
    `;
    res.json({ success: true });
  } catch (err) {
    console.error('Eroare SQL valorinormale:', err);
    res.status(500).json({ error: 'Eroare la salvare valori normale.' });
  }
});

app.get('/api/doctor/pacient/:id/alarme', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await new sql.Request()
      .input('PacientID', sql.Int, id)
      .query(`
        SELECT AlarmaID, PacientID, TipAlarma, Descriere
        FROM AlarmeAvertizari
        WHERE PacientID = @PacientID
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Eroare la obținerea alarmelor:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/doctor/pacient/:id/alarme', async (req, res) => {
  const { id } = req.params;
  const { TipAlarma, Descriere } = req.body;
  
  try {
    await new sql.Request()
      .input('PacientID', sql.Int, id)
      .input('TipAlarma', sql.NVarChar(50), TipAlarma)
      .input('Descriere', sql.NVarChar(sql.MAX), Descriere)
      .query(`
        INSERT INTO AlarmeAvertizari (PacientID, TipAlarma, Descriere)
        VALUES (@PacientID, @TipAlarma, @Descriere)
      `);
    
    res.status(201).json({ message: 'Alarmă adăugată cu succes' });
  } catch (err) {
    console.error('Eroare la adăugarea alarmei:', err);
    res.status(500).json({ error: err.message });
  }
});

// Adaugă acest endpoint după celelalte endpoint-uri pentru alarme
app.delete('/api/doctor/pacient/:id/alarme/:alarmaId', async (req, res) => {
  const { id, alarmaId } = req.params;
  
  try {
    await new sql.Request()
      .input('AlarmaID', sql.Int, alarmaId)
      .input('PacientID', sql.Int, id)
      .query(`
        DELETE FROM AlarmeAvertizari
        WHERE AlarmaID = @AlarmaID AND PacientID = @PacientID
      `);
    
    res.json({ message: 'Alarmă ștearsă cu succes' });
  } catch (err) {
    console.error('Eroare la ștergerea alarmei:', err);
    res.status(500).json({ error: 'Eroare la ștergerea alarmei' });
  }
});

app.get('/', (req, res) => {
  res.send('SenCare backend API running.');
});
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
  });
}); 