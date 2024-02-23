require("dotenv").config();
const ethers = require("ethers");
exports.network = 'Telos Mainnet';
// Native Token
exports.nativeToken = 'TLOS';
// mainnet RPC url
exports.providerUrl = 'https://1rpc.io/telos/evm';
// provider
exports.provider = new ethers.providers.JsonRpcProvider(
    exports.providerUrl,
  );
