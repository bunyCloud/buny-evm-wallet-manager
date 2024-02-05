// Import the required libraries
const EthCrypto = require('eth-crypto');
const sqlite3 = require('sqlite3').verbose();
const term = require('terminal-kit').terminal;
const { ethers } = require('ethers');

// Connect to the SQLite database
const db = new sqlite3.Database('./ethIdentities.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
      return;
    }
    console.log('Connected to the SQLite database.');
  
    // Create a table for Ethereum identities if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS identities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      privateKey TEXT NOT NULL,
      publicKey TEXT NOT NULL
    )`, [], (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        // Once the table is ready, display the main menu
        mainMenu();
      }
    });
  });

// Function to create and save a new Ethereum identity
function createAndSaveIdentity(callback) {
    const identity = EthCrypto.createIdentity();
    const insert = 'INSERT INTO identities (address, privateKey, publicKey) VALUES (?, ?, ?)';
    db.run(insert, [identity.address, identity.privateKey, identity.publicKey], function(err) {
      if (err) {
        console.error('Error inserting data into database', err.message);
      } else {
        console.log(`New Ethereum identity created and saved with ID: ${this.lastID}`);
        // Optionally, you can list all identities again or perform another action
      }
      // Check if a callback function is provided
      if (callback && typeof callback === 'function') {
        callback(); // Call the callback function, which can be the mainMenu function
      }
    });
  }
  
  function listAndSelectIdentity(callback) {
    const query = 'SELECT id, address, publicKey FROM identities';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data from database', err.message);
            return callback && callback(err); // Return to callback with error
        }
        if (rows.length > 0) {
            console.log('Available Ethereum Identities:');
            let options = rows.map(row => `ID: ${row.id}, Address: ${row.address}`);
            term.singleColumnMenu(options, (error, response) => {
                if (error) {
                    console.error('Error selecting identity', error.message);
                    return callback && callback(error);
                }
                // Store the selected identity as the active wallet
                let selectedIdentity = rows[response.selectedIndex];
                console.log(`You selected wallet ID: ${selectedIdentity.id} Address: ${selectedIdentity.address}`);
                // Set this identity as the active wallet
                global.activeWallet = { id: selectedIdentity.id, address: selectedIdentity.address, publicKey: selectedIdentity.publicKey };
                
                // Transition to the active wallet menu
                activeWalletMenu(); // No longer calling the provided callback here
            });
        } else {
            console.log('No identities found.');
            callback && callback();
        }
    });
}

async function fetchBalance(address) {
    // Avalanche Fuji Testnet RPC URL
    const rpcUrl = 'https://api.avax-test.network/ext/bc/C/rpc';
  
    // Set up a provider for the Avalanche Fuji Testnet
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    try {
        const balanceBigInt = await provider.getBalance(address);
        // Convert the balance from wei (or, more accurately for Avalanche, the smallest unit of AVAX) to ether (AVAX in this context)
        const balanceInEther = ethers.utils.formatEther(balanceBigInt);
        console.log(`Balance of ${address} on Avalanche Fuji Testnet: ${balanceInEther} AVAX`);
    } catch (error) {
        console.error(`Failed to fetch balance for ${address} on Avalanche Fuji Testnet:`, error);
    }
}


    
  function mainMenu() {
    term.clear();
  
    // Check if there is an active wallet and display its address
    if (global.activeWallet && global.activeWallet.address) {
      term.yellow(`Active Wallet Address: ${global.activeWallet.address}\n`);
    }
  
    term.green('What would you like to do?\n');
    term.green('1. Load existing wallet from database\n');
    term.green('2. Create new wallet\n');
    term.green('3. Import a wallet\n');
    term.green('4. Exit\n');
  
    term.on('key', function(name, matches, data) {
      if (name === 'CTRL_C') { process.exit(); } // Exit on CTRL+C
    });
  
    term.inputField(
      { history: [], autoComplete: [], autoCompleteMenu: false },
      function(error, input) {
        switch (input) {
          case '1':
            listAndSelectIdentity(() => {
              setTimeout(mainMenu, 2000); // Wait a bit before showing the main menu again
            });
            break;
          case '2':
            createAndSaveIdentity(() => {
              setTimeout(mainMenu, 2000); // Return to main menu after creation
            });
            break;
          case '3':
            console.log('Import a wallet function goes here.');
            setTimeout(mainMenu, 2000); // Placeholder, adjust as needed
            break;
          case '4':
            process.exit();
            break;
          default:
            console.log('Invalid option. Please enter 1, 2, 3, or 4.');
            setTimeout(mainMenu, 2000); // Show the menu again after a short delay
        }
      }
    );
  }
  
  function activeWalletMenu() {
    term.clear();
  
    // Display the active wallet address
    if (global.activeWallet && global.activeWallet.address) {
      term.yellow(`Active Wallet Address: ${global.activeWallet.address}\n`);
    }
  
    term.green('Active Wallet Menu:\n');
    term.green('1. View Balance\n');
    term.green('2. Open Position\n');
    term.green('3. View Position\n');
    term.green('4. Transfer\n');
    term.green('5. Main Menu\n');
  
    term.inputField(
      { history: [], autoComplete: [], autoCompleteMenu: false },
      function(error, input) {
        switch (input) {
            case '1':
                if (global.activeWallet && global.activeWallet.address) {
                    fetchBalance(global.activeWallet.address).then(() => {
                        setTimeout(activeWalletMenu, 2000); // Return to the active wallet menu after displaying the balance
                    });
                } else {
                    console.log('No active wallet selected.');
                    setTimeout(activeWalletMenu, 2000);
                }
                break;
          case '2':
            // Placeholder for Transfer functionality
            console.log('Transfer functionality goes here.');
            setTimeout(activeWalletMenu, 2000); // Return to active wallet menu after action
            break;
            case '3':
                console.log('Open Position');
                break;
                case '4':
                    console.log('Viewing Positions');
            break;
            case '5':
            mainMenu(); // Return to the main menu
            break;
          default:
            console.log('Invalid option. Please enter 1, 2, or 3.');
            setTimeout(activeWalletMenu, 2000); // Show the menu again after a short delay
        }
      }
    );
  }
  
// Make sure to close the database connection when you're done
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database', err.message);
    } else {
      console.log('Closed the database connection.');
    }
  });
});
