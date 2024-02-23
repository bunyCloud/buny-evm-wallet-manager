// balanceService.js
const { ethers } = require('ethers');
const {
provider,
network,
  } = require("../config");

async function fetchBalance(address) {
    
    

    try {
        const balanceBigInt = await provider.getBalance(address);
        const balance = ethers.utils.formatEther(balanceBigInt);
        const balanceInEther = parseFloat(balance).toFixed(2);

        
        return balanceInEther; // Return the balance
    } catch (error) {
        console.error(`Failed to fetch balance for ${address} on ${network}:`, error);
        return null; // Return null in case of error
    }
}

module.exports = { fetchBalance };
