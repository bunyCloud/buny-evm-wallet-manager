require("dotenv").config();
const ethers = require("ethers");
exports.network = 'Avalance Mainnet';
// Token name (used in logging)
exports.tokenName = "WETH";
// Native Token
exports.nativeToken = 'AVAX';
// Wrapped Ethereum
exports.weth = '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB';
// USDC
exports.usdc = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
// Vault Address
exports.vaultAddress = "0x9ab2De34A33fB459b538c43f251eB825645e8595";
// Avalanche mainnet RPC url
exports.providerUrl = 'https://api.avax.network/ext/bc/C/rpc';
// provider
exports.provider = new ethers.providers.JsonRpcProvider(
    exports.providerUrl,
  );
