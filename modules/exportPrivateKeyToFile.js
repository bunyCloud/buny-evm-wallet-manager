// exportPrivateKey.js
const fs = require('fs');
const path = require('path');
const { fetchPrivateKeyForAddress } = require('./fetchPrivateKeyForAddress'); // Adjust the import path as needed

function exportPrivateKeyToFile(activeWalletAddress) {
    if (!activeWalletAddress) {
        console.log("No active wallet selected.");
        return;
    }

    fetchPrivateKeyForAddress(activeWalletAddress, (err, privateKey) => {
        if (err) {
            console.error("Failed to retrieve private key.", err);
            return;
        }

        const filePath = path.join(__dirname, '..', 'output', `${activeWalletAddress}-private-key.txt`);

        
        fs.writeFile(filePath, privateKey, (err) => {
            if (err) {
                console.error("Failed to write private key to file.", err);
            } else {
                console.log(`Private key was successfully exported to ${filePath}`);
            }
        });
    });
}

module.exports = { exportPrivateKeyToFile };
