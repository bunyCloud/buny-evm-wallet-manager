// /menus/activeWalletMenu.js
const term = require('terminal-kit').terminal;
const { exportPrivateKeyToFile } = require('../modules/exportPrivateKeyToFile');
const { initiateTransfer } = require('../modules/initiateTransfer');
const { fetchBalance } = require('../modules/fetchBalance');
const { mainMenu } = require('./mainMenu');

async function activeWalletMenu() {
  term.clear();
  
  if (global.activeWallet && global.activeWallet.address) {
    term.yellow(`Active Wallet Address: ${global.activeWallet.address}`);
    
    // Fetch the balance dynamically
    const balance = await fetchBalance(global.activeWallet.address);
    if (balance !== null) {
        term.cyan(` | Balance: ${balance} AVAX\n`);
    } else {
        term.cyan(" | Balance: Fetching failed or not available\n");
    }
} else {
    term.yellow("No active wallet selected.\n");
}

  term.green("Wallet Menu:\n");
  term.green("1. View Positions\n");
  term.green("2. Open Position\n");
  term.green("3. Close Position\n");
  term.green("4. Transfer\n");
  term.green("5. Export Private Key\n");
  term.green("6. Main Menu\n");

  term.inputField(
    { history: [], autoComplete: [], autoCompleteMenu: false },
    function (error, input) {
      switch (input) {
        case "1":
          if (global.activeWallet && global.activeWallet.address) {
            console.log("view positions functionality goes here."); // Placeholder
            setTimeout(activeWalletMenu, 2000);
          } else {
            console.log("No active wallet selected.");
            setTimeout(activeWalletMenu, 2000);
          }
          break;
        case "2":
          // Placeholder for Transfer functionality
          console.log("Open Position functionality goes here.");
          setTimeout(activeWalletMenu, 2000); // Return to active wallet menu after action
          break;
        case "3":
          console.log("Close Position");
          break;
        case "4":
          console.log("Transfer balance");
          initiateTransfer(activeWalletMenu);
          break;
          case "5":
                if (global.activeWallet && global.activeWallet.address) {
                    console.log("Exporting private key to file...");
                    exportPrivateKeyToFile(global.activeWallet.address);
                } else {
                    console.log("No active wallet selected.");
                }
                setTimeout(activeWalletMenu, 2000); // Return to the menu
                break;
          case "3":
          mainMenu(); // Return to the main menu
          break;
          
        default:
          console.log("Invalid option. Please enter 1, 2, or 3.");
          setTimeout(activeWalletMenu, 2000); // Show the menu again after a short delay
      }
    },
  );
}

module.exports = { activeWalletMenu };
