
# Ethereum Wallet Manager

Ethereum Wallet Manager is a Node.js application designed for managing Ethereum identities. It leverages SQLite for storage, allowing users to create, list, and select Ethereum identities stored in a local database. Additionally, it integrates with the Avalanche to fetch balances for the Ethereum addresses.

- **`eth-crypto`**: A library for Ethereum cryptography operations, such as creating identities (addresses, public keys, and private keys).
- **`sqlite3`**: Provides a lightweight disk-based database that doesn’t require a separate server process, ideal for local storage of data in a structured format.
- **`terminal-kit`**: A comprehensive library for making terminal applications, offering features like input fields, menus, color output, and more.
- **`ethers`**: A complete Ethereum library and wallet implementation, allowing interaction with the Ethereum blockchain and its ecosystem.

## Features

- **Identity Management**: Create and store Ethereum identities with their addresses, private keys, and public keys.
- **Database Storage**: Use SQLite for persistent storage of Ethereum identities.
- **Balance Checking**: Fetch and display the balance of any Ethereum address on the Avalanche .
- **Interactive Terminal Interface**: Navigate through the application's features using an intuitive terminal interface.

## Prerequisites

Before running this application, ensure you have Node.js and npm installed. This application has been tested on Node.js version 14.x and above.

## Installation

1. Clone the repository to your local machine.

```bash {"id":"01HQBY5GZVMA36CBXABY778WTF"}
git clone <repository-url>

```

2. Navigate into the application directory.

```bash {"id":"01HQBY5GZWBBHVSTP8FBPR5XE3"}
cd folder-name

```

3. Install the required dependencies.

```bash {"id":"01HQBY5GZWBBHVSTP8FDARCR4Q"}
yarn

```

## Usage

To start the application, run the following command in your terminal:

```bash {"id":"01HQBY5GZWBBHVSTP8FGY8MY5V"}
yarn start

```

Upon launch, the application will connect to the SQLite database (creating it if it does not exist) and present you with the main menu. From here, you can choose to load an existing wallet, create a new wallet, or import a wallet.

### Main Menu Options

- **Load existing wallet**: Select and load an Ethereum identity from the database.
- **Create new wallet**: Generate a new Ethereum identity and save it to the database.
- **Import a wallet**: Placeholder for future functionality to import a wallet.
- **Exit**: Quit the application.

### Active Wallet Menu

Once an active wallet is selected, you can:

- **View Balance**: Check the balance of the active wallet on Avalanche
- **Export Private Key**: Export active wallet private key to file
- **Transfer**: Placeholder for future functionality.
- **Main Menu**: Return to the main menu.


![mainmenu](https://github.com/bunyCloud/nodejs-eth-wallet-manager/assets/112536156/6a73384c-6dbe-4060-9280-94f2ab337361)

```

## Contributing

Contributions to improve Ethereum Wallet Manager are welcome. Please feel free to fork the repository, make changes, and submit pull requests.

## License

Specify your license here or indicate if the project is open-source.
