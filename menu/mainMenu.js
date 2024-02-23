// /menus/mainMenu.js
const term = require('terminal-kit').terminal;
const { createAndSaveIdentity } = require('../modules/createIdentity');
const { listAndSelectIdentity } = require('../modules/identitySelection');
const { importWallet } = require('../modules/walletImport');
const { activeWalletMenu } = require('./activeWalletMenu');



async function mainMenu() {
  term.clear();

 // Display the active wallet address
 if (global.activeWallet && global.activeWallet.address) {
  term.yellow(`Active Wallet Address: ${global.activeWallet.address}`);
  // Check and display balance if available
  if (global.activeWallet.balance !== null) {
    term.cyan(` | Balance: ${global.activeWallet.balance} AVAX\n`);
  } else {
    term.cyan(" | Balance: Fetching failed or not available\n");
  }
}

  term.green("What would you like to do?\n");
  term.green("1. Load existing wallet from database\n");
  term.green("2. Create new wallet\n");
  term.green("3. Import a wallet\n");
  term.green("4. Exit\n");

  term.on("key", function (name, matches, data) {
    if (name === "CTRL_C") {
      process.exit();
    } // Exit on CTRL+C
  });

  term.inputField(
    { history: [], autoComplete: [], autoCompleteMenu: false },
    function (error, input) {
      switch (input) {
        case "1":
          listAndSelectIdentity(() => {
            setTimeout(mainMenu, 2000); // Wait a bit before showing the main menu again
          });
          break;
        case "2":
          createAndSaveIdentity(() => {
            setTimeout(mainMenu, 2000); 
          });
          break;
          case "3":
            term('Enter wallet public address: ');
            term.inputField((error, publicAddress) => {
              if (error) {
                console.error('Error reading public address:', error);
                return setTimeout(mainMenu, 2000);
              }
              term('\nEnter wallet private key: ');
              term.inputField({ echo: false }, (error, privateKey) => {
                if (error) {
                  console.error('Error reading private key:', error);
                  return setTimeout(mainMenu, 2000);
                }
                importWallet(publicAddress, privateKey, (err) => {
                  if (err) {
                    console.error('Failed to import wallet:', err);
                  } else {
                    console.log('Wallet imported successfully.');
                  }
                  setTimeout(mainMenu, 2000);
                });
              });
            });
            
          break;
        case "4":
          process.exit();
          break;
        default:
          console.log("Invalid option. Please enter 1, 2, 3, or 4.");
          setTimeout(mainMenu, 2000); 
      }
    },
  );
}

module.exports = { mainMenu };
