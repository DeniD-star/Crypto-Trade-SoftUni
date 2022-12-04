const Crypto = require('../models/Crypto');

async function createCrypto(cryptoData){
    const crypto = new Crypto(cryptoData);
    await crypto.save()
    return crypto;
}
async function getAllCryptos(){
   const cryptos = await Crypto.find({}).lean();
   return cryptos;

}

module.exports = {
    createCrypto,
    getAllCryptos
}