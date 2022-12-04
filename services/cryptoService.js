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
async function getCryptoById(id){
   const crypto = await Crypto.findById(id).lean();
   return crypto;

}
async function editCrypto(cryptoId, cryptoData){
   const crypto = await Crypto.findById(cryptoId);
   crypto.name = cryptoData.name;
   crypto.imageUrl = cryptoData.imageUrl;
   crypto.price = Number(cryptoData.price);
   crypto.description = cryptoData.description;
   crypto.paymentMethod = cryptoData.paymentMethod;
   return crypto.save();

}

module.exports = {
    createCrypto,
    getAllCryptos,
    getCryptoById,
    editCrypto
}