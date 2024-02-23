// identityService.js
const EthCrypto = require("eth-crypto");
const sqlite3 = require("sqlite3").verbose();

// Assuming db is initialized in this module, or you can import an initialized db instance
const db = new sqlite3.Database("./ethIdentities.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    return;
  }
  console.log("Connected to the SQLite database.");
});

function createAndSaveIdentity(callback) {
  const identity = EthCrypto.createIdentity();
  const insert = "INSERT INTO identities (address, privateKey, publicKey) VALUES (?, ?, ?)";
  db.run(insert, [identity.address, identity.privateKey, identity.publicKey], function(err) {
    if (err) {
      console.error("Error inserting data into database", err.message);
    } else {
      console.log(`New Ethereum identity created and saved with ID: ${this.lastID}`);
    }
    if (callback && typeof callback === "function") {
      callback(); // Optionally, call the callback function
    }
  });
}

module.exports = { createAndSaveIdentity };
