// fetchPrivateKeyForAddress.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ethIdentities.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    return;
  }
  console.log("Connected to the SQLite database.");
});

function fetchPrivateKeyForAddress(address, callback) {
  db.get('SELECT privateKey FROM identities WHERE address = ?', [address], (err, row) => {
    if (err) {
      console.error('Error fetching private key from database:', err.message);
      callback(err, null);
    } else if (row) {
      callback(null, row.privateKey);
    } else {
      console.log('No private key found for the given address.');
      callback(new Error('Private key not found.'), null);
    }
  });
}

module.exports = { fetchPrivateKeyForAddress };
