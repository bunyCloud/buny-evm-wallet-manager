// Import the required libraries
const sqlite3 = require("sqlite3").verbose();
const term = require("terminal-kit").terminal;
const { fetchBalance } = require("./modules/fetchBalance");
const { createAndSaveIdentity } = require("./modules/createIdentity");
const { exportPrivateKeyToFile } = require("./modules/exportPrivateKeyToFile");
const { initiateTransfer } = require("./modules/initiateTransfer");

// Connect to the SQLite database
const db = new sqlite3.Database(
  "./ethIdentities.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error opening database", err.message);
      return;
    }
    console.log("Connected to the SQLite database.");

    // Create a table for Ethereum identities if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      privateKey TEXT NOT NULL,
      publicKey TEXT NOT NULL
    )`,
      [],
      (err) => {
        if (err) {
          console.error("Error creating table", err.message);
        } else {
          // Once the table is ready, display the main menu
          mainMenu();
        }
      },
    );
  },
);




function listAndSelectIdentity(callback) {
  const query = "SELECT id, address, publicKey FROM identities";
  db.all(query, [], async (err, rows) => { // Note the `async` keyword
    if (err) {
      console.error("Error fetching data from database", err.message);
      return callback && callback(err);
    }
    if (rows.length > 0) {
      console.log("Available Ethereum Identities:");
      let options = rows.map((row) => `ID: ${row.id}, Address: ${row.address}`);
      term.singleColumnMenu(options, async (error, response) => { // Note the `async` keyword
        if (error) {
          console.error("Error selecting identity", error.message);
          return callback && callback(error);
        }
        let selectedIdentity = rows[response.selectedIndex];
        console.log(`You selected wallet ID: ${selectedIdentity.id} Address: ${selectedIdentity.address}`);
        
        global.activeWallet = {
          id: selectedIdentity.id,
          address: selectedIdentity.address,
          publicKey: selectedIdentity.publicKey,
          balance: await fetchBalance(selectedIdentity.address) // Fetch and store balance
        };

        activeWalletMenu(); // Call activeWalletMenu directly
      });
    } else {
      console.log("No identities found.");
      callback && callback();
    }
  });
}

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
/**  term.green("1. View Positions\n");
  term.green("2. Open Position\n");
  term.green("3. Close Position\n"); */
  term.green("1. Transfer\n");
  term.green("2. Export Private Key\n");
  term.green("3. Main Menu\n");

  term.inputField(
    { history: [], autoComplete: [], autoCompleteMenu: false },
    function (error, input) {
      switch (input) {
       /** case "1":
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
          break; */
        case "1":
          console.log("Transfer balance");
          initiateTransfer(activeWalletMenu);
          break;
          case "2":
                if (global.activeWallet && global.activeWallet.address) {
                    console.log("Exporting private key to file...");
                    exportPrivateKeyToFile(global.activeWallet.address);
                } else {
                    console.log("No active wallet selected.");
                }
                setTimeout(activeWalletMenu, 2000); // Return to the menu
                break;
          case "6":
          mainMenu(); // Return to the main menu
          break;
          
        default:
          console.log("Invalid option. Please enter 1, 2, or 3.");
          setTimeout(activeWalletMenu, 2000); // Show the menu again after a short delay
      }
    },
  );
}


function mainMenu() {
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

// Make sure to close the database connection when you're done
process.on("exit", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database", err.message);
    } else {
      console.log("Closed the database connection.");
    }
  });
});
