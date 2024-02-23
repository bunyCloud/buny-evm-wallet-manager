// transferService.js
const { ethers } = require('ethers');
const {
    provider
      } = require("../config");

async function transferFunds(senderPrivateKey, recipientAddress, amount) {
    
    const wallet = new ethers.Wallet(senderPrivateKey, provider);

    try {
        const tx = {
            to: recipientAddress,
            value: ethers.utils.parseEther(amount.toString()),
            gasLimit: ethers.utils.hexlify(100000),
            gasPrice: await provider.getGasPrice(),
        };

        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait();

        console.log(`Transaction successful with hash: ${transactionResponse.hash}`);
        return transactionResponse.hash;
    } catch (error) {
        console.error("Transaction failed:", error);
        return null;
    }
}

module.exports = { transferFunds };
