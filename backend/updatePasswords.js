const bcrypt = require('bcrypt');
const { connectToDb, sql, closeDbConnection } = require('./db'); // Importă din db.js

(async () => {
  try {
    console.log('Inițiere script actualizare parole...');
    await connectToDb(); // Se conectează la baza de date Azure folosind config din db.js

    console.log('Preluare utilizatori din tabela Utilizatori...');
    const result = await sql.query`SELECT UserID, Password FROM Utilizatori`;
    
    if (!result.recordset || result.recordset.length === 0) {
      console.log('Nu s-au găsit utilizatori în tabela Utilizatori.');
      return; // Ieși dacă nu sunt utilizatori
    }
    console.log(`S-au găsit ${result.recordset.length} utilizatori.`);

    for (const user of result.recordset) {
      // Verifică dacă parola este deja un hash bcrypt valid (opțional, dar util)
      // Un hash bcrypt începe de obicei cu $2a$, $2b$, sau $2y$ urmat de cost
      if (user.Password && user.Password.match(/^\$2[aby]\$\d{2}\$/)) {
        console.log(`Parola pentru UserID ${user.UserID} pare să fie deja criptată. Se omite.`);
        continue;
      }
      
      if (!user.Password || user.Password.trim() === '') {
        console.log(`Parola pentru UserID ${user.UserID} este goală sau lipsește. Se omite.`);
        continue;
      }

      console.log(`Criptare parolă pentru UserID: ${user.UserID}...`);
      const hashedPassword = await bcrypt.hash(user.Password, 10); // Cost factor 10
      console.log(`   Parolă originală (nu se afișează), Hash generat: ${hashedPassword.substring(0,10)}...`); // Afișează doar o parte din hash

      await sql.query`
        UPDATE Utilizatori
        SET Password = ${hashedPassword}
        WHERE UserID = ${user.UserID}
      `;
      console.log(`   Parola pentru UserID ${user.UserID} a fost actualizată în baza de date.`);
    }

    console.log('Toate parolele aplicabile au fost procesate și actualizate cu succes!');
  } catch (err) {
    console.error('Eroare majoră în scriptul de actualizare a parolelor:', err);
    if (err.code) {
        console.error(`   Cod eroare SQL: ${err.code}`);
    }
  } finally {
    console.log('Închidere conexiune la baza de date...');
    await closeDbConnection(); // Închide conexiunea la baza de date
    console.log('Script finalizat.');
  }
})();