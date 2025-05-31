console.log('Pornire server.js...');
const express = require('express');
const { connectToDb, sql} = require('./db');
const path = require('path');

const app = express();
const PORT = 4000;
const bcrypt = require('bcrypt');

const cors = require('cors');

const corsOptions = {
  origin: 'https://blue-dune-02cbb2810.6.azurestaticapps.net', // Pune aici URL-ul exact al SWA
  optionsSuccessStatus: 200
};
app.use(cors());
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

    // Update Pacienti
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

    // Update Email în Utilizatori
    const userIdResult = await transaction.request()
      .input('PacientID', sql.Int, id)
      .query(`SELECT UserID FROM Pacienti WHERE PacientID=@PacientID`);
    const userId = userIdResult.recordset[0].UserID;
    await transaction.request()
      .input('UserID', sql.Int, userId)
      .input('Email', sql.NVarChar(255), Email)
      .query(`UPDATE Utilizatori SET Email=@Email WHERE UserID=@UserID`);

    // Update DateMedicale
    await transaction.request()
      .input('PacientID', sql.Int, id)
      .input('IstoricMedical', sql.NVarChar(sql.MAX), IstoricMedical)
      .input('Alergii', sql.NVarChar(sql.MAX), Alergii)
      .input('ConsultatiiCardiologice', sql.NVarChar(sql.MAX), ConsultatiiCardiologice)
      .query(`UPDATE DateMedicale SET IstoricMedical=@IstoricMedical, Alergii=@Alergii, ConsultatiiCardiologice=@ConsultatiiCardiologice WHERE PacientID=@PacientID`);

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

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
  });
}); 