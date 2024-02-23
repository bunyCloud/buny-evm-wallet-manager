// initiateTransferService.js
const term = require('terminal-kit').terminal;
const { transferFunds } = require('./transferFunds'); // Adjust path as necessary
const { fetchPrivateKeyForAddress } = require('./fetchPrivateKeyForAddress'); // Adjust path as necessary

async function initiateTransfer(mainMenu) {
  term('Recipient Address: ');
  term.inputField(async (error, recipientAddress) => {
    // Implementation remains the same...
    term('\nAmount to Transfer: ');
    term.inputField(async (error, amount) => {
      // Continue with the implementation...
      if (!global.activeWallet || !global.activeWallet.address) {
        term.red('No active wallet selected.\n');
        return;
      }

      fetchPrivateKeyForAddress(global.activeWallet.address, async (err, privateKey) => {
        // Continue with the implementation...
        term('\nInitiating transfer...\n');
        const txHash = await transferFunds(privateKey, recipientAddress, amount);

        if (txHash) {
          term.green(`Transfer successful! Transaction hash: ${txHash}\n`);
        } else {
          term.red('Transfer failed.\n');
        }

        // Return to the previous menu or exit
        mainMenu(); // Pass mainMenu as a parameter to the function
      });
    });
  });
}

module.exports = { initiateTransfer };
