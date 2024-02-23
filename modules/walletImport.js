// walletImportService.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ethIdentities.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  }
});

function importWallet(publicAddress, privateKey, callback) {
  const insert = 'INSERT INTO identities (address, privateKey, publicKey) VALUES (?, ?, ?)';
  // Assuming publicKey is the same as publicAddress in this context
  db.run(insert, [publicAddress, privateKey, publicAddress], function(err) {
    if (err) {
      console.error('Error inserting wallet into database', err.message);
      return callback(err);
    } else {
      console.log(`Wallet imported successfully with ID: ${this.lastID}`);
      return callback(null, this.lastID); // Successfully imported
    }
  });
}

module.exports = { importWallet };
